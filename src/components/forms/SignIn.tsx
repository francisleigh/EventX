import { useForm, Controller, UseFormHandleSubmit } from "react-hook-form";
import { SignInSchema, SignInSchemaType } from "~/types.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/core/Button";
import { useState } from "react";
import { TextInput } from "~/components/core/FormElements";
import { ErrorBox } from "~/components/app/ErrorBox";

export const SignInForm = ({
  onSubmit,
}: {
  onSubmit: (formValues: SignInSchemaType) => Promise<void>;
}) => {
  const { control, handleSubmit } = useForm<SignInSchemaType>({
    defaultValues: {
      phoneNumber: "+447715301968",
    },
    resolver: zodResolver(SignInSchema),
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();

  const interceptSubmit = async (formValues: SignInSchemaType) => {
    setSubmitting(true);
    try {
      await onSubmit(formValues);
    } catch (e: any) {
      setSubmissionError(e?.message ?? "Error in sign in form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Controller
        control={control}
        name={"phoneNumber"}
        render={({ field, fieldState }) => (
          <TextInput
            label={"Phone number"}
            keyboardType={"phone-pad"}
            value={field.value}
            onChangeText={field.onChange}
            aria-disabled={field.disabled}
            error={fieldState.error?.message}
          />
        )}
      />

      {!!submissionError && <ErrorBox error={submissionError} />}

      <Button busy={submitting} onPress={handleSubmit(interceptSubmit)}>
        Send verification code
      </Button>
    </>
  );
};
