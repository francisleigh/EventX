import { Card } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
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
import { formatToDate } from "~/util";
import { Avatar } from "~/components/app/Avatar";
import { usePollData, usePollMutations } from "~/hooks/usePollData";
import { Loading } from "~/components/app/Loading";
import { ClientPollDocument } from "~/types.client";
import { Button } from "~/components/core/Button";
import { useEventData } from "~/hooks/useEventData";
import { temp_userid } from "~/tempuser";
import {
  FeatureHeading,
  FeatureHeadingProps,
} from "~/components/core/FeatureHeading";

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

  onRefetchData?: () => any;

  linkProps?: LinkProps<any>;
} & Pick<FeatureHeadingProps, "view">;
export const Poll = ({
  view,
  eventId,
  pollId,
  linkProps,
  onRefetchData,
}: PollProps) => {
  const { fetching, data, getVoteCountForOption, expired, expiresSoon } =
    usePollData({
      eventId,
      pollId,
    });
  const { mutating, optionBeingMutated, voteForOption } = usePollMutations({
    eventId,
    pollId,
  });
  const { data: eventData } = useEventData({ eventId });

  const handleVoteForOption = useCallback(
    async (optionId: string) => {
      await voteForOption(optionId);

      if (onRefetchData) onRefetchData();
    },
    [onRefetchData],
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

  const canEdit = eventData?.owner === temp_userid && view === "full";

  return (
    <Card
      variant={expiresSoon ? "error" : undefined}
      shadow={view !== "full" && expiresSoon}
      style={view === "full" && { borderWidth: 0, paddingHorizontal: 0 }}
    >
      <FeatureHeading view={"full"}>
        {data.title}
        {expiresSoon && (
          <>
            {" "}
            <MaterialCommunityIcons
              name="clock-alert"
              size={24}
              color={colors.detail}
            />
          </>
        )}
      </FeatureHeading>
      {view === "full" && !!data.description && (
        <Card shadow>
          <Text.H2>Description</Text.H2>
          <Text.Span>{data.description}</Text.Span>
        </Card>
      )}
      {canEdit && (
        <Link
          href={{
            pathname: "/new-event-item",
            params: { eventId, eventItemId: pollId },
          }}
          asChild
        >
          <Button
            icon={
              <MaterialCommunityIcons
                name="pencil"
                size={24}
                color={colors.primary}
              />
            }
          >
            Edit
          </Button>
        </Link>
      )}

      {optionsBasedOnView?.map((option) => {
        const optionVotes = getVoteCountForOption(option.id);
        const [dotStyle, dotTextStyle] = getDotStylesFromVotes(optionVotes);

        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => view === "full" && handleVoteForOption(option.id)}
            activeOpacity={view === "full" ? undefined : 1}
            disabled={mutating || expired}
            style={[
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
              view !== "full" && { pointerEvents: "none" },
              (mutating || expired) && { opacity: 0.5 },
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
            <View
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
              {optionBeingMutated === option.id ? (
                <Loading />
              ) : (
                <Dot style={[dotStyle, { borderWidth: 1 }]} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      {view === "full" && (
        <>
          {expired ? null : (
            <Link
              href={{
                pathname: "/new-poll-option",
                params: {
                  eventId,
                  pollId: data.id,
                },
              }}
              asChild
            >
              <Button icon={<Text.Button>+</Text.Button>}>Add option</Button>
            </Link>
          )}

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

          {!!data?.expiry && (
            <Card shadow>
              <Text.H2>Due date</Text.H2>
              <Text.Body>
                {formatToDate(data.expiry.toDate())}
                {expired && " - Ended"}
              </Text.Body>
            </Card>
          )}
        </>
      )}
      {!!linkProps && view !== "full" && (
        // @ts-ignore
        <Link {...linkProps}>
          <View
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
          </View>
        </Link>
      )}
    </Card>
  );
};
