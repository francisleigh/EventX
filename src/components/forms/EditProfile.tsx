import { useForm, Controller } from "react-hook-form";
import { UserProfileSchema, UserProfileSchemaType } from "~/types.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/core/Button";
import { useState } from "react";
import { TextInput } from "~/components/core/FormElements";
import { ErrorBox } from "~/components/app/ErrorBox";

export const EditProfileForm = ({
  onSubmit,
  defaultValues = {},
}: {
  onSubmit: (formValues: UserProfileSchemaType) => Promise<void>;
  defaultValues?: Partial<UserProfileSchemaType>;
}) => {
  const { control, handleSubmit } = useForm<UserProfileSchemaType>({
    defaultValues: {
      ...defaultValues,
    },
    resolver: zodResolver(UserProfileSchema),
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();

  const interceptSubmit = async (formValues: UserProfileSchemaType) => {
    setSubmitting(true);
    try {
      await onSubmit(formValues);
    } catch (e: any) {
      setSubmissionError(e?.message ?? "Error in edit profile form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Controller
        control={control}
        name={"displayName"}
        render={({ field, fieldState }) => (
          <TextInput
            label={"Username"}
            value={field.value}
            onChangeText={field.onChange}
            aria-disabled={field.disabled}
            error={fieldState.error?.message}
          />
        )}
      />

      {!!submissionError && <ErrorBox error={submissionError} />}

      <Button busy={submitting} onPress={handleSubmit(interceptSubmit)}>
        Update
      </Button>
    </>
  );
};
