import { useForm, Controller } from "react-hook-form";
import { BillPaymentSchemaType, BillPaymentSchema } from "~/types.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/core/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import { TextInput } from "~/components/core/FormElements";
import { addPaymentToBill } from "~/db";
import { ErrorBox } from "~/components/app/ErrorBox";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { gap } from "~/constants/spacing";

export const NewBillPaymentForm = ({
  eventId,
  billId,
  userId,
}: {
  eventId: string;
  billId: string;
  userId: string;
}) => {
  const { control, handleSubmit, reset } = useForm<BillPaymentSchemaType>({
    defaultValues: {
      userId,
    },
    resolver: zodResolver(BillPaymentSchema),
  });
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined);

  const canGoBack = useRef(true);

  useEffect(() => {
    if (paymentId) {
      if (canGoBack.current) {
        setPaymentId(undefined);
        router.back();
      } else {
        reset();
        setPaymentId(undefined);
      }
    }
  }, [paymentId, canGoBack, setPaymentId, reset, router]);

  const submit = useCallback(
    async (formValues: BillPaymentSchemaType) => {
      setPaymentId(undefined);
      setSubmissionError(undefined);
      setSubmitting(true);
      try {
        const optionId = await addPaymentToBill(eventId, billId, formValues);
        if (optionId) setPaymentId(optionId);
      } catch (e) {
        console.log("NewBillPaymentForm error", e);
        setSubmissionError("Error trying to create bill payment");
      } finally {
        setSubmitting(false);
      }
    },
    [setSubmitting, setSubmissionError, canGoBack],
  );

  const handleSubmitAndGoBack = useCallback(() => {
    canGoBack.current = true;
    handleSubmit(submit)();
  }, [handleSubmit, submit, canGoBack]);

  const handleSubmitAndAddAnother = useCallback(() => {
    canGoBack.current = false;
    handleSubmit(submit)();
  }, [handleSubmit, submit, canGoBack]);

  return (
    <>
      <Controller
        control={control}
        name={"quantity"}
        render={({ field, fieldState }) => (
          <TextInput
            label={"Amount"}
            keyboardType={"numeric"}
            value={field.value ? String(field.value) : undefined}
            onChangeText={(numberAsString) =>
              field.onChange(numberAsString ? +numberAsString : null)
            }
            aria-disabled={field.disabled}
            error={fieldState.error?.message}
          />
        )}
      />

      {!!submissionError && <ErrorBox error={submissionError} />}

      <View style={{ flexDirection: "row", gap: gap.xs }}>
        <Button busy={submitting} onPress={handleSubmitAndAddAnother}>
          Create and add another
        </Button>
        <Button busy={submitting} onPress={handleSubmitAndGoBack}>
          Create
        </Button>
      </View>
    </>
  );
};
