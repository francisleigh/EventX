import { useForm, Controller } from "react-hook-form";
import { ListItemSchema, ListItemSchemaType } from "~/types.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/core/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import { TextInput } from "~/components/core/FormElements";
import { addItemToList } from "~/db";
import { ErrorBox } from "~/components/app/ErrorBox";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { gap } from "~/constants/spacing";

export const NewListItemForm = ({
  eventId,
  listId,
}: {
  eventId: string;
  listId: string;
}) => {
  const { control, handleSubmit, reset } = useForm<ListItemSchemaType>({
    defaultValues: {
      status: "pending",
    },
    resolver: zodResolver(ListItemSchema),
  });
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();
  const [itemId, setItemId] = useState<string | undefined>(undefined);

  const canGoBack = useRef(true);

  useEffect(() => {
    if (itemId) {
      if (canGoBack.current) {
        setItemId(undefined);
        router.back();
      } else {
        console.log("reset form");
        reset();
        setItemId(undefined);
      }
    }
  }, [itemId, canGoBack, setItemId, reset, router]);

  const submit = useCallback(
    async (formValues: ListItemSchemaType) => {
      setItemId(undefined);
      setSubmissionError(undefined);
      setSubmitting(true);
      try {
        const listItemId = await addItemToList(eventId, listId, formValues);
        if (listItemId) setItemId(listItemId);
      } catch (e) {
        console.log("NewListItemForm error", e);
        setSubmissionError("Error trying to create list item");
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
        name={"title"}
        render={({ field, fieldState }) => (
          <TextInput
            label={"Name"}
            value={field.value}
            onChangeText={field.onChange}
            aria-disabled={field.disabled}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name={"quantity"}
        render={({ field, fieldState }) => (
          <TextInput
            label={"Quantity"}
            value={field.value ? String(field.value) : undefined}
            keyboardType={"numeric"}
            onChangeText={(numberAsString) =>
              field.onChange(numberAsString ? +numberAsString : undefined)
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
