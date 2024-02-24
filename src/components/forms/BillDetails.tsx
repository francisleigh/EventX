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
import {
  formatToSortCode,
  removeAllWhitespace,
  removeUndefinedFields,
} from "~/util";
import { Text } from "~/components/core/Text";
import { TextInput } from "~/components/core/FormElements";
import { ErrorBox } from "~/components/app/ErrorBox";
import { Button } from "~/components/core/Button";
import { View } from "react-native";
import { gap } from "~/constants/spacing";
import { Card } from "~/components/core/Layout";

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
        render={({ field, fieldState, formState }) => (
          <TextInput
            label={"Total owed"}
            value={field.value ? String(field.value) : undefined}
            keyboardType={"numeric"}
            onChangeText={(numberAsString) =>
              field.onChange(numberAsString ? +numberAsString : null)
            }
            aria-disabled={field.disabled}
            error={fieldState.error?.message}
          />
        )}
      />

      <Card>
        <Text.Subheading>Payment details</Text.Subheading>

        <Controller
          control={control}
          name={"accountPayeeName"}
          render={({ field, fieldState, formState }) => (
            <TextInput
              label={"Name on account"}
              value={field.value ? String(field.value) : undefined}
              onChangeText={field.onChange}
              aria-disabled={field.disabled}
              error={fieldState.error?.message}
            />
          )}
        />

        <View style={{ flexDirection: "row", gap: gap.default }}>
          <Controller
            control={control}
            name={"accountNumber"}
            render={({ field, fieldState, formState }) => (
              <TextInput
                label={"Account number"}
                value={field.value ? String(field.value) : undefined}
                keyboardType={"numeric"}
                onChangeText={(value) =>
                  field.onChange(removeAllWhitespace(value))
                }
                aria-disabled={field.disabled}
                error={fieldState.error?.message}
              />
            )}
          />

          <View style={{ flex: 0.39 }}>
            <Controller
              control={control}
              name={"sortCode"}
              render={({ field, fieldState, formState }) => (
                <TextInput
                  label={"Sort code"}
                  value={field.value}
                  keyboardType={"numbers-and-punctuation"}
                  maxLength={8}
                  onChangeText={(value = "") =>
                    field.onChange(formatToSortCode(value))
                  }
                  aria-disabled={field.disabled}
                  error={fieldState.error?.message}
                />
              )}
            />
          </View>
        </View>
      </Card>

      {!!submissionError && <ErrorBox error={submissionError} />}

      <Button busy={submitting} onPress={handleSubmit(submit)}>
        {"Save"}
      </Button>
    </>
  );
};
