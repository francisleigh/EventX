import { useForm, Controller } from "react-hook-form";
import { EventSchema, EventSchemaType } from "~/types.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/core/Button";
import { useCallback, useState } from "react";
import {
  DateRangePicker,
  TextArea,
  TextInput,
} from "~/components/core/FormElements";
import { createNewEvent, updateExistingEvent } from "~/db";
import { ErrorBox } from "~/components/app/ErrorBox";
import { useRouter } from "expo-router";
import { removeUndefinedFields } from "~/util";

type Props = {
  eventId?: string;
  defaultValues?: EventSchemaType;
  userId: string;
};

export const NewEventForm = (props: Props) => {
  const { control, handleSubmit, watch, setValue } = useForm<EventSchemaType>({
    defaultValues: {
      owner: props.userId,
      ...(props.defaultValues ?? {}),
      start: props.defaultValues?.start,
      end: props.defaultValues?.end,
    },
    resolver: zodResolver(EventSchema),
  });
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();

  const startDateWatch = watch("start");
  const endDateWatch = watch("end");

  const isEditMode =
    !!props.eventId &&
    !!props.defaultValues &&
    !!Object.keys(props.defaultValues).length;

  const submit = useCallback(
    async (formValues: EventSchemaType) => {
      setSubmissionError(undefined);
      setSubmitting(true);

      try {
        if (isEditMode) {
          await updateExistingEvent(
            props.eventId as string,
            removeUndefinedFields<typeof formValues>(formValues),
          );
          router.back();
        } else {
          const newEventId = await createNewEvent(formValues);
          router.replace({ pathname: "/event", params: { id: newEventId } });
        }
      } catch (e) {
        console.log("NewEventForm error", e);
        setSubmissionError(
          `Error trying to ${isEditMode ? "update" : "create"} event`,
        );
      } finally {
        setSubmitting(false);
      }
    },
    [setSubmitting, setSubmissionError, isEditMode],
  );

  return (
    <>
      <Controller
        control={control}
        name={"title"}
        render={({ field, fieldState }) => (
          <TextInput
            label={"Title"}
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
            label={"Description"}
            value={field.value}
            onChangeText={field.onChange}
            aria-disabled={field.disabled}
            error={fieldState.error?.message}
          />
        )}
      />

      <DateRangePicker
        label={"Event start and finish"}
        onChange={(start, end) => {
          setValue("start", start ?? undefined);
          setValue("end", end ?? undefined);
        }}
        value={{ start: startDateWatch, end: endDateWatch }}
      />

      {!!submissionError && <ErrorBox error={submissionError} />}

      <Button busy={submitting} onPress={handleSubmit(submit)}>
        {isEditMode ? "Save" : "Create"}
      </Button>
    </>
  );
};
