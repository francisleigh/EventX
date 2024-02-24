import { StyleSheet, View } from "react-native";
import { useMessageThread } from "~/hooks/useMessageThread";
import { Text } from "~/components/core/Text";
import { Loading } from "~/components/app/Loading";
import { gap, padding } from "~/constants/spacing";
import { sHeight } from "~/constants/layout";
import { colors } from "~/constants/colors";
import { MessageBubble } from "~/components/app/MessageBubble";
import { SendMessageForm } from "~/components/forms/SendMessage";
import { FlashList } from "@shopify/flash-list";

export const MessageThread = (props: { threadId: string }) => {
  const { data, messages, fetchingMessages, fetchingThread } = useMessageThread(
    { threadId: props.threadId },
  );

  if (fetchingThread) return <Loading />;

  if (!data) return <Text.H1>No thread data</Text.H1>;

  return (
    <>
      <Text.H1>Thread {data?.id}</Text.H1>
      <FlashList
        data={messages}
        style={styles.listContainer}
        contentContainerStyle={styles.listContentContainer}
        keyExtractor={(item) => item.id}
        estimatedItemSize={100}
        renderItem={({ item: m }) => {
          return (
            <MessageBubble
              threadData={data}
              message={m}
              onInteraction={(messageData) =>
                console.log("interact with", messageData)
              }
            />
          );
        }}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={styles.composeContainer}>
            <SendMessageForm threadId={data.id} />
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        ListFooterComponent={<View style={styles.listFooter} />}
        ListEmptyComponent={
          fetchingMessages ? (
            <Loading />
          ) : (
            <Text.H2>Send your first message</Text.H2>
          )
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  listContainer: {
    minHeight: "100%",
    maxHeight: sHeight,
  },
  listContentContainer: {
    padding: padding.sm,
    gap: gap.sm,
  },
  composeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.sm,
    padding: padding.sm,
    backgroundColor: colors.secondary,
  },
  listFooter: {
    padding: padding["screen-y"],
  },
  listSeparator: {
    padding: padding.sm,
  },
});
