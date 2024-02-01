import { useForm, Controller } from "react-hook-form";
import { EventItemSchema, EventItemSchemaType } from "~/types.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/core/Button";
import { useCallback, useState } from "react";
import { TextArea, TextInput } from "~/components/core/FormElements";
import {} from "~/db";
import { ErrorBox } from "~/components/app/ErrorBox";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { gap } from "~/constants/spacing";
import { Text } from "~/components/core/Text";

export const NewEventItemForm = ({ eventId }: { eventId: string }) => {
  const { control, handleSubmit } = useForm<EventItemSchemaType>({
    defaultValues: {
      expiry: new Date(),
    },
    resolver: zodResolver(EventItemSchema),
  });
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();

  const submit = useCallback(
    async (formValues: EventItemSchemaType) => {
      console.log("eventId", eventId);
      console.log("form values", formValues);

      setSubmissionError(undefined);
      setSubmitting(true);
      try {
        // const newEventItemId = await createNewEvent(formValues);
        // console.log("New event", newEventId);
        // router.replace({ pathname: "/event-item", params: { id: newEventItemId } });
      } catch (e) {
        console.log("NewEventItemForm error", e);
        setSubmissionError("Error trying to create event item");
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
        name={"type"}
        render={({ field }) => (
          <View
            style={{ flexDirection: "row", gap: gap.xs, alignItems: "center" }}
          >
            <View style={{ flex: 1 }}>
              <Button
                selected={field.value == "poll"}
                onPress={() => field.onChange("poll")}
              >
                Poll
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                selected={field.value == "bill"}
                onPress={() => field.onChange("bill")}
              >
                Bill
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                selected={field.value == "list"}
                onPress={() => field.onChange("list")}
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

      <Controller
        control={control}
        name={"expiry"}
        render={({ field }) => (
          <View style={{ gap: gap.xs }}>
            <Text.Span>Due date</Text.Span>
            <Text.H2>{field?.value?.toDateString()}</Text.H2>
          </View>
        )}
      />

      {!!submissionError && <ErrorBox error={submissionError} />}

      <Button busy={submitting} onPress={handleSubmit(submit)}>
        Create
      </Button>
    </>
  );
};
