import { ListItem } from "~/components/app/ListItem";
import { Card } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { gap, padding } from "~/constants/spacing";
import { Div } from "@expo/html-elements";
import { Link, LinkProps } from "expo-router";
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { useMemo } from "react";
import { View } from "react-native";
import { expiresSoon, formatToDate } from "~/util";
import { useListData } from "~/hooks/useListData";
import { Loading } from "~/components/app/Loading";

type ListProps = {
  eventId: string;
  listId: string;

  onItemPress?: () => any;
  view?: "full";
  linkProps?: LinkProps<any>;
};

export const List = ({
  eventId,
  listId,
  view,
  onItemPress,
  linkProps,
}: ListProps) => {
  const { fetching, data } = useListData({ eventId, listId });

  const TitleBasedOnView = useMemo(
    () => (view === "full" ? Text.H1 : Text.H2),
    [view],
  );
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

  const willExpireSoon = !!data?.expiry && expiresSoon(data.expiry.toDate());

  if (fetching) return <Loading />;

  if (!data) return <Text.H1>No list data</Text.H1>;

  return (
    <Card
      variant={willExpireSoon ? "error" : undefined}
      shadow={view !== "full" && willExpireSoon}
      style={view === "full" && { borderWidth: 0, paddingHorizontal: 0 }}
    >
      <TitleBasedOnView>
        {data.title}{" "}
        {willExpireSoon && (
          <>
            {" "}
            <MaterialCommunityIcons
              name="clock-alert"
              size={24}
              color={colors.detail}
            />
          </>
        )}
      </TitleBasedOnView>
      {view === "full" && !!data.description && (
        <Card shadow>
          <Text.H2>Description</Text.H2>
          <Text.Span>{data.description}</Text.Span>
        </Card>
      )}

      {view === "full" ? (
        <Div
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
        </Div>
      ) : (
        <Div
          style={{
            gap: gap.sm,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Div>
            <Text.Body>{data.items.length} items</Text.Body>
            {!!totalAssignees ? (
              <Text.Span>
                {totalAssignees} assignee{totalAssignees > 1 ? "s" : ""}
              </Text.Span>
            ) : (
              <Text.Span>No items Assigned</Text.Span>
            )}
          </Div>

          {statusIcon}
        </Div>
      )}

      {view === "full" && !!data.expiry && (
        <Card shadow>
          <Text.H2>Due date</Text.H2>
          <Text.Body>{formatToDate(data.expiry.toDate())}</Text.Body>
        </Card>
      )}

      {!!linkProps && view !== "full" && (
        // @ts-ignore
        <Link {...linkProps}>
          <Div
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingVertical: padding.sm,
            }}
          >
            <Text.Span>See more</Text.Span>
            <AntDesign name="arrowright" size={24} color={colors.primary} />
          </Div>
        </Link>
      )}
    </Card>
  );
};
