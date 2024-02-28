import { useForm, Controller } from "react-hook-form";
import { FAQSchema, FAQSchemaType } from "~/types.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/core/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import { TextArea, TextInput } from "~/components/core/FormElements";
import { addFAQToEvent, updateFAQItem } from "~/db";
import { ErrorBox } from "~/components/app/ErrorBox";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { gap } from "~/constants/spacing";
import { removeUndefinedFields } from "~/util";

export const NewFAQForm = ({
  eventId,
  faqId,
  defaultValues,
}: {
  eventId: string;
  faqId: string;
  defaultValues: Partial<FAQSchemaType>;
}) => {
  const { control, handleSubmit, reset, formState } = useForm<FAQSchemaType>({
    defaultValues: {},
    resolver: zodResolver(FAQSchema),
  });
  const router = useRouter();

  console.log("errors", formState.errors);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();
  const [itemId, setItemId] = useState<string | undefined>(undefined);

  const canGoBack = useRef(true);

  const isEditMode =
    !!eventId && !!defaultValues && !!Object.keys(defaultValues).length;

  useEffect(() => {
    if (itemId) {
      if (canGoBack.current) {
        setItemId(undefined);
        router.back();
      } else {
        reset();
        setItemId(undefined);
      }
    }
  }, [itemId, canGoBack, setItemId, reset, router]);

  const submit = useCallback(
    async (formValues: FAQSchemaType) => {
      setItemId(undefined);
      setSubmissionError(undefined);
      setSubmitting(true);
      try {
        if (isEditMode) {
          await updateFAQItem(
            eventId,
            faqId,
            removeUndefinedFields<typeof formValues>(formValues),
          );
          router.back();
        } else {
          const faqItemId = await addFAQToEvent(eventId, formValues);
          if (faqItemId) setItemId(faqItemId);
        }
      } catch (e) {
        console.log("FAQItemForm error", e);
        setSubmissionError("Error trying to create FAQ item");
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
        name={"body"}
        render={({ field, fieldState }) => (
          <TextArea
            label={"Body"}
            value={field.value ? String(field.value) : undefined}
            onChangeText={field.onChange}
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
