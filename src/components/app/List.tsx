import { ListItem } from "~/components/app/ListItem";
import { Card } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { gap } from "~/constants/spacing";
import { LinkProps } from "expo-router";
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

type ListProps = {
  eventId: string;
  listId: string;

  onItemPress?: () => any;

  linkProps?: LinkProps<any>;
} & Pick<FeatureHeadingProps, "view">;

export const List = ({
  eventId,
  listId,
  view,
  onItemPress,
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
      variant={expiresSoon ? "error" : undefined}
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
                pathname: "/new-event-item",
                params: { eventId, eventItemId: listId },
              }
            : undefined
        }
      >
        {data.title}{" "}
      </FeatureHeading>
      {view === "full" && !!data.description && (
        <Card shadow>
          <Text.H2>Description</Text.H2>
          <Text.Span>{data.description}</Text.Span>
        </Card>
      )}

      {view === "full" ? (
        <View
          style={{
            gap: gap.sm,
          }}
        >
          {itemsBasedOnView.map((item) => (
            <ListItem
              key={item.id}
              {...item}
              onItemPress={view === "full" ? onItemPress : undefined}
            />
          ))}
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
            <Text.Body>{data.items.length} items</Text.Body>
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

      {view === "full" && (
        <ExpiryDetails expiry={data?.expiry} expired={expired} />
      )}

      <SeeMore linkProps={linkProps} view={view} />
    </Card>
  );
};
