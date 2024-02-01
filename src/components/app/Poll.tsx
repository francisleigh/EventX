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
import { usePollData } from "~/hooks/usePollData";
import { Loading } from "~/components/app/Loading";
import { ClientPollDocument } from "~/types.client";

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

const handleOpenLink = async (item: ClientPollDocument["options"][number]) => {
  if (await Linking.canOpenURL(item.link!)) {
    await Linking.openURL(item.link!);
  }
};

type PollProps = {
  eventId: string;
  pollId: string;

  onItemPress?: () => any;

  view?: "full";
  linkProps?: LinkProps<any>;
};
export const Poll = ({
  view,
  eventId,
  pollId,
  linkProps,
  onItemPress,
}: PollProps) => {
  const { fetching, data, getVoteCountForOption } = usePollData({
    eventId,
    pollId,
  });

  const TitleBasedOnView = useMemo(
    () => (view === "full" ? Text.H1 : Text.H2),
    [view],
  );

  const optionsBasedOnView =
    view === "full" ? data?.options : data?.options?.slice(0, 3);

  const scoresObject = useMemo(
    () =>
      data?.voters?.reduce(
        (scoreObj, vote) => {
          if (scoreObj[vote.optionId]) {
            return {
              ...scoreObj,
              [vote.optionId]: ++scoreObj[vote.optionId],
            };
          }

          return {
            ...scoreObj,
            [vote.optionId]: 1,
          };
        },
        {} as { [key in string]: number },
      ),
    [data?.voters],
  );

  const scoresSortedAndDeduped = useMemo(
    () => [...new Set(Object.values(scoresObject ?? {}))].sort().reverse(),
    [scoresObject],
  );

  const getDotStylesFromVotes = useCallback(
    (votes: number): [StyleProp<ViewStyle>, StyleProp<TextStyle>] => {
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

  if (fetching) return <Loading />;

  if (!data) return <Text.H1>No poll data</Text.H1>;

  console.log("poll dat", data);

  const willExpireSoon = !!data.expiry && expiresSoon(data.expiry.toDate());

  return (
    <Card
      variant={willExpireSoon ? "error" : undefined}
      shadow={view !== "full" && willExpireSoon}
      style={view === "full" && { borderWidth: 0, paddingHorizontal: 0 }}
    >
      <TitleBasedOnView>
        {data.title}
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

      {optionsBasedOnView?.map((option) => {
        const optionVotes = getVoteCountForOption(option.id);
        const [dotStyle, dotTextStyle] = getDotStylesFromVotes(optionVotes);

        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => onItemPress && onItemPress()}
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
              <Text.Body>{option.label}</Text.Body>
              {view === "full" && !!option.link && (
                <TouchableOpacity onPress={() => handleOpenLink(option)}>
                  <Text.Span style={{ textDecorationLine: "underline" }}>
                    {option.link}
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
                  {optionVotes}
                </Text.Span>
              )}
              <Dot style={[dotStyle, { borderWidth: 1 }]} />
            </Div>
          </TouchableOpacity>
        );
      })}

      {view === "full" && (
        <>
          {!!data?.voters?.length && (
            <Card shadow>
              <Text.H2>People</Text.H2>
              <View style={{ flexDirection: "row", gap: gap.xs }}>
                {data.voters.slice(0, 7).map((vote) => (
                  <Avatar key={vote.userId} source={{ uri: vote.userId }} />
                ))}
                {data.voters.length > 8 && (
                  <Dot
                    color={"secondary"}
                    style={{ borderWidth: 1, borderColor: colors.primary }}
                  >
                    <Text.Span>+{data.voters.slice(8).length}</Text.Span>
                  </Dot>
                )}
              </View>
            </Card>
          )}

          {view === "full" && !!data?.expiry && (
            <Card shadow>
              <Text.H2>Due date</Text.H2>
              <Text.Body>{formatToDate(data.expiry.toDate())}</Text.Body>
            </Card>
          )}
        </>
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
