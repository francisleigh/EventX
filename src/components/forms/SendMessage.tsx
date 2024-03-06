import { useForm, Controller } from "react-hook-form";
import { MessageSchema, MessageSchemaType } from "~/types.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/core/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import { TextInput } from "~/components/core/FormElements";
import { sendMessageToThread, updateMessageThreadDocument } from "~/db";
import { colors } from "~/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { User } from "@firebase/auth";

export const SendMessageForm = ({
  threadId,
  defaultValues = {},
  userId,
}: {
  threadId: string;
  defaultValues?: Partial<MessageSchemaType>;
  userId: User["uid"];
}) => {
  const { control, handleSubmit, reset, formState } =
    useForm<MessageSchemaType>({
      defaultValues: {
        userId,
        ...defaultValues,
      },
      resolver: zodResolver(MessageSchema),
    });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();
  const [messageId, setMessageId] = useState<string | undefined>(undefined);

  const canGoBack = useRef(true);

  useEffect(() => {
    if (messageId) {
      reset();
      setMessageId(undefined);
    }
  }, [messageId, setMessageId, reset]);

  const submit = useCallback(
    async (formValues: Pick<MessageSchemaType, "body">) => {
      setMessageId(undefined);
      setSubmissionError(undefined);
      setSubmitting(true);
      try {
        const newMessageCreatedAt = new Date();
        const newMessageId = await sendMessageToThread(threadId, {
          ...formValues,
          userId,
          createdAt: newMessageCreatedAt,
        });
        if (newMessageId) {
          setMessageId(newMessageId);
          await updateMessageThreadDocument(threadId, {
            updatedAt: newMessageCreatedAt,
          });
        }
      } catch (e) {
        console.log("SendMessageForm error", e);
        setSubmissionError("Error trying to send message");
      } finally {
        setSubmitting(false);
      }
    },
    [setSubmitting, setSubmissionError, canGoBack],
  );

  return (
    <>
      <Controller
        control={control}
        name={"body"}
        render={({ field, fieldState }) => (
          <TextInput
            placeholder={"Message"}
            value={field.value}
            onChangeText={field.onChange}
            aria-disabled={field.disabled}
            error={fieldState.error?.message}
          />
        )}
      />

      {/*{!!submissionError && <ErrorBox error={submissionError} />}*/}
      <Button
        busy={submitting}
        onPress={handleSubmit(submit)}
        icon={
          <MaterialCommunityIcons
            name="send"
            size={24}
            color={colors.primary}
          />
        }
      />
    </>
  );
};
