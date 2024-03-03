import { useForm, Controller } from "react-hook-form";
import {
  PhoneVerificationSchema,
  PhoneVerificationSchemaType,
} from "~/types.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/core/Button";
import { useState } from "react";
import { TextInput } from "~/components/core/FormElements";
import { ErrorBox } from "~/components/app/ErrorBox";

export const PhoneVerificationForm = ({
  onSubmit,
}: {
  onSubmit: (formValues: PhoneVerificationSchemaType) => Promise<void>;
}) => {
  const { control, handleSubmit } = useForm<PhoneVerificationSchemaType>({
    defaultValues: {},
    resolver: zodResolver(PhoneVerificationSchema),
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();

  const interceptSubmit = async (formValues: PhoneVerificationSchemaType) => {
    setSubmitting(true);
    try {
      await onSubmit(formValues);
    } catch (e: any) {
      setSubmissionError(e?.message ?? "Error in phone verification form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Controller
        control={control}
        name={"verificationCode"}
        render={({ field, fieldState }) => (
          <TextInput
            label={"Verification code"}
            keyboardType={"numeric"}
            value={field.value}
            onChangeText={field.onChange}
            aria-disabled={field.disabled}
            error={fieldState.error?.message}
          />
        )}
      />

      {!!submissionError && <ErrorBox error={submissionError} />}

      <Button busy={submitting} onPress={handleSubmit(interceptSubmit)}>
        Submit
      </Button>
    </>
  );
};
