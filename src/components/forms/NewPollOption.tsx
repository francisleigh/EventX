import { useForm, Controller } from "react-hook-form";
import { PollOptionSchemaType, PollOptionSchema } from "~/types.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/core/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import { TextInput } from "~/components/core/FormElements";
import { addOptionToPoll } from "~/db";
import { ErrorBox } from "~/components/app/ErrorBox";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { gap } from "~/constants/spacing";

export const NewPollOptionForm = ({
  eventId,
  pollId,
}: {
  eventId: string;
  pollId: string;
}) => {
  const { control, handleSubmit, reset } = useForm<PollOptionSchemaType>({
    defaultValues: {},
    resolver: zodResolver(PollOptionSchema),
  });
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();
  const [optionId, setOptionId] = useState<string | undefined>(undefined);

  const canGoBack = useRef(true);

  useEffect(() => {
    if (optionId) {
      if (canGoBack.current) {
        setOptionId(undefined);
        router.back();
      } else {
        console.log("reset form");
        reset();
        setOptionId(undefined);
      }
    }
  }, [optionId, canGoBack, setOptionId, reset, router]);

  const submit = useCallback(
    async (formValues: PollOptionSchemaType) => {
      setOptionId(undefined);
      setSubmissionError(undefined);
      setSubmitting(true);
      try {
        const optionId = await addOptionToPoll(eventId, pollId, formValues);
        if (optionId) setOptionId(optionId);
      } catch (e) {
        console.log("NewPollOptionForm error", e);
        setSubmissionError("Error trying to create poll option");
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
    console.log("handleSubmitAndAddAnother");
    canGoBack.current = false;
    handleSubmit(submit)();
  }, [handleSubmit, submit, canGoBack]);

  return (
    <>
      <Controller
        control={control}
        name={"label"}
        render={({ field, fieldState }) => (
          <TextInput
            placeholder={"Label"}
            value={field.value}
            onChangeText={field.onChange}
            aria-disabled={field.disabled}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name={"link"}
        render={({ field, fieldState }) => (
          <TextInput
            placeholder={"Link"}
            value={field.value}
            onChangeText={field.onChange}
            aria-disabled={field.disabled}
            error={fieldState.error?.message}
            autoCapitalize={"none"}
            keyboardType={"url"}
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
