import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { ClientMessageThreadDocument } from "~/types.client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getMessageThreadDocument, getMessageThreadMessages } from "~/db";
import { MessageDocument, MessageThreadRootDocument } from "~/types.firestore";

type UseMessageThreadRTN = {
  fetchingThread: boolean;
  fetchingMessages: boolean;

  data: Omit<ClientMessageThreadDocument, "messages"> | undefined;
} & Pick<ClientMessageThreadDocument, "messages">;

export const useMessageThread = ({
  threadId,
}: {
  threadId: string;
}): UseMessageThreadRTN => {
  const [fetchingThread, setFetchingThread] =
    useState<UseMessageThreadRTN["fetchingThread"]>(true);
  const [fetchingMessages, setFetchingMessages] =
    useState<UseMessageThreadRTN["fetchingMessages"]>(true);
  const [data, setData] = useState<UseMessageThreadRTN["data"]>();
  const [messages, setMessages] = useState<UseMessageThreadRTN["messages"]>([]);

  const firestoreUnsubscribe = useRef<Unsubscribe | null>(null);

  const getMessages = useCallback(async () => {
    setFetchingMessages(true);
    try {
      const _messages = await getMessageThreadMessages(threadId);

      setMessages(_messages);
    } catch (e) {
      console.log("useMessageThread -> getMessages error", e);
    } finally {
      setFetchingMessages(false);
    }
  }, [data?.id, data?.updatedAt]);

  const setupThreadListener = useCallback(
    async (threadId: string) => {
      if (firestoreUnsubscribe.current) return;

      setFetchingThread(true);
      try {
        const messageThread = await getMessageThreadDocument(threadId);
        if (messageThread.exists()) {
          firestoreUnsubscribe.current = onSnapshot(
            messageThread.ref,
            async (snapshot) => {
              const data =
                snapshot.data() as unknown as MessageThreadRootDocument;

              setData({
                ...data,
                id: snapshot.id,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
              });

              await getMessages();
            },
            (error) => {
              console.log(
                "useMessageThreads -> setupThreadListener error",
                error,
              );
            },
          );
        }
      } catch (e) {
        console.log("useMessageThread -> setupThreadListener error", e);
      } finally {
        setFetchingThread(false);
      }
    },
    [getMessages],
  );

  useEffect(() => {
    void setupThreadListener(threadId);
    return () => {
      firestoreUnsubscribe.current && firestoreUnsubscribe.current();
    };
  }, [threadId, firestoreUnsubscribe]);

  useEffect(() => {}, []);

  return {
    data,
    fetchingThread,

    fetchingMessages,
    messages,
  };
};
