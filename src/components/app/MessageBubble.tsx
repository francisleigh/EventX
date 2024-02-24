import { MessageDocument } from "~/types.firestore";
import { ClientMessageThreadDocument } from "~/types.client";
import { Text } from "~/components/core/Text";
import { Card } from "~/components/core/Layout";
import { StyleSheet, View } from "react-native";
import { temp_userid } from "~/tempuser";

type Props = {
  threadData: Omit<ClientMessageThreadDocument, "messages">;
  message: ClientMessageThreadDocument["messages"][number];
  onInteraction: (messageData: MessageDocument) => void;
};

export const MessageBubble = ({
  message,
  threadData,
  onInteraction,
}: Props) => {
  const userIsSender = message.userId === temp_userid;
  return (
    <View style={styles.bubbleContainer}>
      <Card
        style={[
          styles.messageBubble,
          userIsSender ? styles.messageBubbleRight : styles.messageBubbleLeft,
        ]}
        colorVariant={userIsSender ? "success" : undefined}
      >
        <Text.Span>{message.body}</Text.Span>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    width: "100%",
  },
  messageBubble: {
    maxWidth: "75%",
  },
  messageBubbleLeft: {
    alignSelf: "flex-start",
  },
  messageBubbleRight: {
    alignSelf: "flex-end",
  },
});
