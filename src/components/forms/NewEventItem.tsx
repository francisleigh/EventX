import { useForm, Controller } from "react-hook-form";
import { EventItemSchema, EventItemSchemaType } from "~/types.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/core/Button";
import { useCallback, useState } from "react";
import { DayPicker, TextArea, TextInput } from "~/components/core/FormElements";
import {
  createEventItem,
  updateExistingEvent,
  updateExistingEventItem,
} from "~/db";
import { ErrorBox } from "~/components/app/ErrorBox";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { gap } from "~/constants/spacing";
import { Text } from "~/components/core/Text";
import { addDays } from "date-fns";
import { removeUndefinedFields } from "~/util";

type Props = {
  eventId: string;
  eventItemId?: string;

  defaultValues?: EventItemSchemaType;
};
export const NewEventItemForm = ({
  eventId,
  eventItemId,
  defaultValues,
}: Props) => {
  const { control, handleSubmit } = useForm<EventItemSchemaType>({
    defaultValues: {
      ...(defaultValues ?? {}),
    },
    resolver: zodResolver(EventItemSchema),
  });
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();

  const isEditMode =
    !!eventItemId && !!defaultValues && !!Object.keys(defaultValues).length;

  const submit = useCallback(
    async (formValues: EventItemSchemaType) => {
      setSubmissionError(undefined);
      setSubmitting(true);
      try {
        if (isEditMode) {
          await updateExistingEventItem(
            eventId,
            eventItemId,
            removeUndefinedFields<typeof formValues>(formValues),
          );
          router.back();
        } else {
          const { type, id: newEventItemId } = await createEventItem(
            eventId,
            formValues,
          );
          router.replace({
            pathname: `/${type}`,
            params: { id: newEventItemId, eventId },
          });
        }
      } catch (e) {
        console.log("NewEventItemForm error", e);
        setSubmissionError("Error trying to create event item");
      } finally {
        setSubmitting(false);
      }
    },
    [setSubmitting, setSubmissionError, isEditMode, eventItemId, eventId],
  );

  return (
    <>
      <Controller
        control={control}
        name={"type"}
        render={({ field }) => (
          <View
            style={{ flexDirection: "row", gap: gap.xs, alignItems: "center" }}
          >
            <View style={{ flex: 1 }}>
              <Button
                selected={field.value == "poll"}
                onPress={isEditMode ? () => {} : () => field.onChange("poll")}
              >
                Poll
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                selected={field.value == "bill"}
                onPress={isEditMode ? () => {} : () => field.onChange("bill")}
              >
                Bill
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                selected={field.value == "list"}
                onPress={isEditMode ? () => {} : () => field.onChange("list")}
              >
                List
              </Button>
            </View>
          </View>
        )}
      />

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

      <Controller
        control={control}
        name={"expiry"}
        render={({ field }) => (
          <DayPicker
            value={field.value}
            onChange={(v) => field.onChange(v ?? undefined)}
          />
        )}
      />

      {!!submissionError && <ErrorBox error={submissionError} />}

      <Button busy={submitting} onPress={handleSubmit(submit)}>
        {isEditMode ? "Save" : "Create"}
      </Button>
    </>
  );
};
