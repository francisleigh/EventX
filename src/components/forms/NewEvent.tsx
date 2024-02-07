import { useForm, Controller } from "react-hook-form";
import { EventSchema, EventSchemaType } from "~/types.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/core/Button";
import { useCallback, useState } from "react";
import { TextArea, TextInput } from "~/components/core/FormElements";
import { createNewEvent } from "~/db";
import { ErrorBox } from "~/components/app/ErrorBox";
import { useRouter } from "expo-router";
import { temp_userid } from "~/tempuser";

export const NewEventForm = () => {
  const { control, handleSubmit } = useForm<EventSchemaType>({
    defaultValues: {
      owner: temp_userid,
    },
    resolver: zodResolver(EventSchema),
  });
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();

  const submit = useCallback(
    async (formValues: EventSchemaType) => {
      console.log("form values", formValues);

      setSubmissionError(undefined);
      setSubmitting(true);
      try {
        const newEventId = await createNewEvent(formValues);

        console.log("New event", newEventId);
        router.replace({ pathname: "/event", params: { id: newEventId } });
      } catch (e) {
        console.log("NewEventForm error", e);
        setSubmissionError("Error trying to create event");
      } finally {
        setSubmitting(false);
      }
    },
    [setSubmitting, setSubmissionError],
  );

  return (
    <>
      <Controller
        control={control}
        name={"title"}
        render={({ field, fieldState }) => (
          <TextInput
            placeholder={"Title"}
            value={field.value}
            onChangeText={field.onChange}
            aria-disabled={field.disabled}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name={"description"}
        render={({ field, fieldState }) => (
          <TextArea
            placeholder={"Description"}
            value={field.value}
            onChangeText={field.onChange}
            aria-disabled={field.disabled}
            error={fieldState.error?.message}
          />
        )}
      />

      {!!submissionError && <ErrorBox error={submissionError} />}

      <Button busy={submitting} onPress={handleSubmit(submit)}>
        Create
      </Button>
    </>
  );
};
