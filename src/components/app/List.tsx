import { ListItem } from "~/components/app/ListItem";
import { Card } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { gap } from "~/constants/spacing";
import { Link, LinkProps } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { useMemo } from "react";
import { View } from "react-native";
import { formatToDate } from "~/util";
import { useListData } from "~/hooks/useListData";
import { Loading } from "~/components/app/Loading";
import {
  FeatureHeading,
  FeatureHeadingProps,
} from "~/components/core/FeatureHeading";
import { SeeMore } from "~/components/core/SeeMore";
import { ExpiryDetails } from "~/components/core/ExpiryDetails";
import { EventItemDescription } from "~/components/core/EventItemDescription";
import { Button } from "~/components/core/Button";

type ListProps = {
  eventId: string;
  listId: string;

  onRefetchData?: () => any;

  linkProps?: LinkProps<any>;
} & Pick<FeatureHeadingProps, "view">;

export const List = ({
  eventId,
  listId,
  view,
  onRefetchData,
  linkProps,
}: ListProps) => {
  const { fetching, data, expiresSoon, expired, parentExpired, canEdit } =
    useListData({
      eventId,
      listId,
    });

  const itemsBasedOnView = useMemo(
    () => (view === "full" ? data?.items : data?.items?.slice(0, 3)) ?? [],
    [data?.items, view],
  );
  const allItemsWithAnAssignee = useMemo(
    () => data?.items?.filter(({ userId }) => !!userId) ?? [],
    [data?.items],
  );
  const assigneesDeduped = useMemo(
    () => [...new Set(allItemsWithAnAssignee.map(({ userId }) => userId))],
    [allItemsWithAnAssignee],
  );
  const totalAssignees = useMemo(
    () => assigneesDeduped.length,
    [assigneesDeduped],
  );
  const allStatuses = useMemo(
    () => [...(new Set(data?.items?.map(({ status }) => status)) ?? [])],
    [data?.items],
  );

  const statusIcon = useMemo(() => {
    if (!allStatuses.length) return null;

    if (allStatuses.every((s) => s === "done")) {
      return <Entypo name="progress-full" size={24} color={colors.success} />;
    }

    if (allStatuses.includes("pending") && allStatuses.includes("done")) {
      return <Entypo name="progress-two" size={24} color={colors.primary} />;
    }

    if (allStatuses.every((s) => !s)) {
      return <Entypo name="progress-empty" size={24} color={colors.detail} />;
    }

    return <Entypo name="progress-one" size={24} color={colors.primary} />;
  }, [allStatuses]);

  if (fetching) return <Loading />;

  if (!data) return <Text.H1>No list data</Text.H1>;

  return (
    <Card
      colorVariant={expiresSoon ? "error" : undefined}
      shadow={view !== "full" && expiresSoon}
      style={view === "full" && { borderWidth: 0, paddingHorizontal: 0 }}
    >
      <FeatureHeading
        view={view}
        parentExpired={parentExpired}
        expiresSoon={expiresSoon}
        expired={expired}
        editLinkHref={
          canEdit
            ? {
                pathname: "/event-item-form",
                params: { eventId, eventItemId: listId },
              }
            : undefined
        }
        eventId={eventId}
        eventItemId={listId}
        eventItemType={"list"}
        threadId={data.threadId}
      >
        {data.title}{" "}
      </FeatureHeading>
      {view === "full" && !!data.description && (
        <EventItemDescription>{data.description}</EventItemDescription>
      )}
      {view === "full" && !!data?.expiry && (
        <ExpiryDetails expiry={data?.expiry} expired={expired} />
      )}

      {view === "full" ? (
        <View
          style={{
            gap: gap.sm,
          }}
        >
          {itemsBasedOnView.map((item) => (
            <Link
              href={{
                pathname: "/list-item-controls",
                params: { eventId, listId, id: item.id },
              }}
            >
              <ListItem key={item.id} {...item} />
            </Link>
          ))}
          {expired ? null : (
            <Link
              href={{
                pathname: "/list-item-form",
                params: {
                  eventId,
                  listId,
                },
              }}
              asChild
            >
              <Button icon={<Text.Button>+</Text.Button>}>Add item</Button>
            </Link>
          )}
        </View>
      ) : (
        <View
          style={{
            gap: gap.sm,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text.Span>{data.items.length} items</Text.Span>
            {!!totalAssignees ? (
              <Text.Span>
                {totalAssignees} assignee{totalAssignees > 1 ? "s" : ""}
              </Text.Span>
            ) : (
              <Text.Span>No items Assigned</Text.Span>
            )}
          </View>

          {statusIcon}
        </View>
      )}

      <SeeMore linkProps={linkProps} view={view} />
    </Card>
  );
};
