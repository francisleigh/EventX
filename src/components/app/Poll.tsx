import { Card } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { Div } from "@expo/html-elements";
import { gap, padding } from "~/constants/spacing";
import { Dot } from "~/components/core/Dot";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { colors } from "~/constants/colors";
import { Link, LinkProps } from "expo-router";
import { useCallback, useMemo } from "react";
import { expiresSoon, formatToDate } from "~/util";
import { Avatar } from "~/components/app/Avatar";

const dotStylesByVote = StyleSheet.create({
  top: {
    backgroundColor: colors.success,
  },
  runnerUp: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.success,
  },
  thirdPlace: {
    backgroundColor: colors.primary,
  },
  betweenLosersAndThird: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.detail,
  },
  losers: {
    backgroundColor: colors.detail,
  },
  noVotes: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
});
const dotTextStylesByVote = StyleSheet.create({
  top: {},
  runnerUp: {},
  thirdPlace: {},
  betweenLosersAndThird: {},
  losers: {},
  noVotes: {
    color: "transparent",
  },
});

const handleOpenLink = async (item: PollItem) => {
  if (await Linking.canOpenURL(item.link!)) {
    await Linking.openURL(item.link!);
  }
};

type PollItem = {
  id: string;
  label: string;
  link?: string;
  votes?: number;
};

type PollProps = {
  view?: "full";
  title: string;
  description?: string;
  expiry?: Date;
  items: PollItem[];
  voters?: string[];
  linkProps?: LinkProps<any>;
  onItemPress?: (item: PollItem) => any;
};
export const Poll = ({
  view,
  title,
  description,
  expiry,
  items,
  voters,
  linkProps,
  onItemPress,
}: PollProps) => {
  const TitleBasedOnView = useMemo(
    () => (view === "full" ? Text.H1 : Text.H2),
    [view],
  );
  const itemsBasedOnView = useMemo(
    () =>
      (view === "full" ? items : items.slice(0, 3)).sort((ia, ib) =>
        (ia?.votes ?? 0) >= (ib?.votes ?? 0) ? -1 : 1,
      ),
    [items, view],
  );

  const scoresSortedAndDeduped = useMemo(
    () => [
      ...new Set(
        items
          .filter(({ votes }) => typeof votes !== "undefined")
          .map(({ votes }) => votes),
      ),
    ],
    [items],
  );

  const getDotStylesFromVotes = useCallback(
    (
      votes: PollItem["votes"],
    ): [StyleProp<ViewStyle>, StyleProp<TextStyle>] => {
      const [firstPlace, runnerUp, thirdPlace, ...restOfPlaces] =
        scoresSortedAndDeduped;
      const lastPlace = restOfPlaces[restOfPlaces.length - 1];
      if (!votes) {
        return [dotStylesByVote.noVotes, dotTextStylesByVote.noVotes];
      }

      if (votes === firstPlace) {
        return [dotStylesByVote.top, dotTextStylesByVote.top];
      }

      if (votes === runnerUp) {
        return [dotStylesByVote.runnerUp, dotTextStylesByVote.runnerUp];
      }

      if (votes === thirdPlace) {
        return [dotStylesByVote.thirdPlace, dotTextStylesByVote.thirdPlace];
      }

      if (votes === lastPlace) {
        return [dotStylesByVote.losers, dotTextStylesByVote.losers];
      }

      return [
        dotStylesByVote.betweenLosersAndThird,
        dotTextStylesByVote.betweenLosersAndThird,
      ];
    },
    [scoresSortedAndDeduped],
  );

  const willExpireSoon = !!expiry && expiresSoon(expiry);

  return (
    <Card
      variant={willExpireSoon ? "error" : undefined}
      shadow={view !== "full" && willExpireSoon}
      style={view === "full" && { borderWidth: 0, paddingHorizontal: 0 }}
    >
      <TitleBasedOnView>
        {title}
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

      {view === "full" && !!description && (
        <Card shadow>
          <Text.H2>Description</Text.H2>
          <Text.Span>{description}</Text.Span>
        </Card>
      )}

      {itemsBasedOnView.map((item) => {
        const [dotStyle, dotTextStyle] = getDotStylesFromVotes(item.votes);
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => onItemPress && onItemPress(item)}
            activeOpacity={onItemPress ? undefined : 1}
            style={[
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
              view !== "full" && { pointerEvents: "none" },
            ]}
          >
            <View
              style={{
                padding: 0,
                paddingVertical: 0,
                paddingTop: 0,
              }}
            >
              <Text.Body>{item.label}</Text.Body>
              {view === "full" && !!item.link && (
                <TouchableOpacity onPress={() => handleOpenLink(item)}>
                  <Text.Span style={{ textDecorationLine: "underline" }}>
                    {item.link}
                  </Text.Span>
                </TouchableOpacity>
              )}
            </View>
            <Div
              style={{
                flexDirection: "row",
                gap: gap.sm,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {view === "full" && (
                <Text.Span
                  style={[dotTextStyle, { fontVariant: ["tabular-nums"] }]}
                >
                  {item.votes || 1}
                </Text.Span>
              )}
              <Dot style={[dotStyle, { borderWidth: 1 }]} />
            </Div>
          </TouchableOpacity>
        );
      })}

      {view === "full" && (
        <>
          {!!voters?.length && (
            <Card shadow>
              <Text.H2>People</Text.H2>
              <View style={{ flexDirection: "row", gap: gap.xs }}>
                {voters
                  .slice(0, 7)
                  .filter(Boolean)
                  .map((uid) => (
                    <Avatar key={uid} source={{ uri: uid }} />
                  ))}
                {voters.length > 8 && (
                  <Dot
                    color={"secondary"}
                    style={{ borderWidth: 1, borderColor: colors.primary }}
                  >
                    <Text.Span>+{voters.slice(8).length}</Text.Span>
                  </Dot>
                )}
              </View>
            </Card>
          )}

          {view === "full" && !!expiry && (
            <Card shadow>
              <Text.H2>Due date</Text.H2>
              <Text.Body>{formatToDate(expiry)}</Text.Body>
            </Card>
          )}
        </>
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
