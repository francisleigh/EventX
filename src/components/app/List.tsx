import { ListItem } from "~/components/app/ListItem";
import { Card } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { gap, padding } from "~/constants/spacing";
import { Div } from "@expo/html-elements";
import { Link, LinkProps } from "expo-router";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { useMemo } from "react";
import { View } from "react-native";
import { formatToDate } from "~/util";

type ListProps = {
  items: Omit<Parameters<typeof ListItem>[0], "onItemPress">[];
  title: string;
  description?: string;
  expiry?: Date;
  view?: "full";
  linkProps?: LinkProps<any>;
} & Pick<Parameters<typeof ListItem>[0], "onItemPress">;

export const List = ({
  items,
  title,
  description,
  expiry,
  view,
  linkProps,
  onItemPress,
}: ListProps) => {
  const TitleBasedOnView = useMemo(
    () => (view === "full" ? Text.H1 : Text.H2),
    [view],
  );
  const itemsBasedOnView = useMemo(
    () => (view === "full" ? items : items.slice(0, 3)),
    [items, view],
  );
  const allItemsWithAnAssignee = useMemo(
    () => items.filter(({ assignee }) => !!assignee),
    [items],
  );
  const assigneesDeduped = useMemo(
    () => [...new Set(allItemsWithAnAssignee.map(({ assignee }) => assignee))],
    [allItemsWithAnAssignee],
  );
  const totalAssignees = useMemo(
    () => assigneesDeduped.length,
    [assigneesDeduped],
  );
  const allStatuses = useMemo(
    () => [...new Set(items.map(({ status }) => status))],
    [items],
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

  return (
    <Card style={view === "full" && { borderWidth: 0, paddingHorizontal: 0 }}>
      <TitleBasedOnView>{title}</TitleBasedOnView>
      {view === "full" && !!description && (
        <Card shadow>
          <Text.H2>Description</Text.H2>
          <Text.Span>{description}</Text.Span>
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
            <Text.Body>{items.length} items</Text.Body>
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

      {view === "full" && !!expiry && (
        <Card shadow>
          <Text.H2>Due date</Text.H2>
          <Text.Body>{formatToDate(expiry)}</Text.Body>
        </Card>
      )}

      {!!linkProps && view !== "full" && (
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
