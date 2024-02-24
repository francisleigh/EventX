import { ReactNode, useCallback, useMemo, useState } from "react";
import { Text } from "~/components/core/Text";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Link, LinkProps, useRouter } from "expo-router";
import { UseEventItemDataHookRTN } from "~/types.hooks";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { gap, padding } from "~/constants/spacing";
import {
  ClientBillDocument,
  ClientListDocument,
  ClientPollDocument,
} from "~/types.client";
import {
  createMessageThreadDocument,
  updateExistingEvent,
  updateExistingEventItem,
} from "~/db";
import { Loading } from "~/components/app/Loading";

type HREF = LinkProps<any>["href"];
type EventItemGenericShape = UseEventItemDataHookRTN<
  ClientBillDocument | ClientListDocument | ClientPollDocument
>;
export type FeatureHeadingProps = {
  view?: "full";
  children: ReactNode | string;
  editLinkHref?: HREF;
  eventId?: EventItemGenericShape["data"]["id"];
  eventItemId?: EventItemGenericShape["data"]["id"];
} & Partial<
  Pick<EventItemGenericShape, "expired" | "expiresSoon" | "parentExpired">
> &
  Pick<EventItemGenericShape["data"], "threadId">;

export const FeatureHeading = ({
  view,
  children,
  editLinkHref,
  expiresSoon,
  expired,
  parentExpired,
  eventId,
  eventItemId,
  threadId,
}: FeatureHeadingProps) => {
  const router = useRouter();
  const TitleBasedOnView = useMemo(
    () => (view === "full" ? Text.H1 : Text.H2),
    [view],
  );

  const [creatingThread, setCreatingThread] = useState<boolean>(false);

  const handleCreateNewThread = useCallback(async () => {
    setCreatingThread(true);
    try {
      const newThreadId = await createMessageThreadDocument(
        eventId!,
        eventItemId,
      );

      if (eventId && eventItemId) {
        await updateExistingEventItem(eventId, eventItemId, {
          threadId: newThreadId,
        });
      } else if (!!eventId) {
        await updateExistingEvent(eventId, { threadId: newThreadId });
      }

      if (newThreadId) {
        router.navigate(
          `/message-thread?id=${newThreadId}&eventId=${eventId}${eventItemId ? `&eventItemId=${eventItemId}` : ""}`,
        );
      }
    } catch (e) {
      console.log("FeatureHeading -> handleCreateNewThread error", e);
    } finally {
      setCreatingThread(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      {view === "full" && (
        <View style={styles.headerContainer}>
          {router.canGoBack() && (
            <TouchableOpacity style={styles.headerButton} onPress={router.back}>
              <AntDesign name="arrowleft" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}

          <View style={styles.headerIconContainer}>
            {router.canGoBack() && (
              <>
                {parentExpired || expired ? (
                  <MaterialCommunityIcons
                    name="coffin"
                    size={24}
                    color={colors.primary}
                  />
                ) : expiresSoon ? (
                  <MaterialCommunityIcons
                    name="clock-alert"
                    size={24}
                    color={colors.detail}
                  />
                ) : null}
              </>
            )}

            {!!threadId && !!eventId ? ( // @ts-ignore
              <Link
                href={{
                  pathname: "/message-thread",
                  params: {
                    id: threadId,
                    eventId: eventId,
                    eventItemId: eventItemId ?? "",
                  },
                }}
                asChild
              >
                <TouchableOpacity style={styles.headerButton}>
                  <MaterialCommunityIcons
                    name="message"
                    size={24}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </Link>
            ) : !!eventId ? (
              // @ts-ignore

              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleCreateNewThread}
              >
                {creatingThread ? (
                  <Loading />
                ) : (
                  <MaterialCommunityIcons
                    name="message-plus"
                    size={24}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            ) : null}

            {!!editLinkHref && view === "full" && (
              // @ts-ignore
              <Link href={editLinkHref} asChild>
                <TouchableOpacity style={styles.headerButton}>
                  <MaterialCommunityIcons
                    name="pencil"
                    size={24}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </Link>
            )}
          </View>
        </View>
      )}

      <View style={styles.titleContainer}>
        <TitleBasedOnView>{children}</TitleBasedOnView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: gap.sm,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: gap.sm,
  },
  headerButton: {
    padding: padding.sm,
  },
  titleContainer: {
    position: "relative",
  },
});
