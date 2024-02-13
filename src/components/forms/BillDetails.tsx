import { Controller, useForm, UseFormProps } from "react-hook-form";
import {
  BillPaymentDetailsSchema,
  BillPaymentDetailsSchemaType,
  BillSchema,
  BillSchemaType,
} from "~/types.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { updateExistingEventItem } from "~/db";
import { removeUndefinedFields } from "~/util";
import { TextInput } from "~/components/core/FormElements";
import { ErrorBox } from "~/components/app/ErrorBox";
import { Button } from "~/components/core/Button";

export type BillPaymentDetailsFormProps = {
  eventId: string;
  billId: string;
  defaultValues?: Partial<Pick<BillPaymentDetailsSchemaType, "totalOwed">>;
};
export const BillPaymentDetailsForm = ({
  eventId,
  billId,
  defaultValues = {},
}: BillPaymentDetailsFormProps) => {
  const { control, handleSubmit, reset } = useForm<BillSchemaType>({
    defaultValues: { ...defaultValues },
    resolver: zodResolver(BillPaymentDetailsSchema),
  });
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();

  const submit = useCallback(
    async (formValues: BillSchemaType) => {
      console.log("form values", formValues);

      setSubmissionError(undefined);
      setSubmitting(true);
      try {
        await updateExistingEventItem(
          eventId,
          billId,
          removeUndefinedFields<typeof formValues>(formValues),
        );
        router.back();
      } catch (e) {
        console.log("BillPaymentDetailsForm error", e);
        setSubmissionError("Error trying to update event item");
      } finally {
        setSubmitting(false);
      }
    },
    [setSubmitting, setSubmissionError, billId, eventId],
  );

  return (
    <>
      <Controller
        control={control}
        name={"totalOwed"}
        render={({ field, fieldState, formState }) => {
          console.log("field", field);
          console.log("fieldstate", fieldState);
          console.log("formstate", formState);
          return (
            <TextInput
              placeholder={"Total owed"}
              value={field.value ? String(field.value) : undefined}
              keyboardType={"numeric"}
              onChangeText={(numberAsString) =>
                field.onChange(numberAsString ? +numberAsString : null)
              }
              aria-disabled={field.disabled}
              error={fieldState.error?.message}
            />
          );
        }}
      />

      {!!submissionError && <ErrorBox error={submissionError} />}

      <Button busy={submitting} onPress={handleSubmit(submit)}>
        {"Save"}
      </Button>
    </>
  );
};
