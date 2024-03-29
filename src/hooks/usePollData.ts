import { ClientPollDocument } from "~/types.client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getEventItem,
  getPollOptions,
  getPollVoters,
  voteForPollOption,
} from "~/db";
import { PollRootDocument } from "~/types.firestore";
import { expiresSoon, hasExpired } from "~/util";
import { UseEventItemDataHookRTN } from "~/types.hooks";
import { useEventData } from "~/hooks/useEventData";
import { useSession } from "~/ctx/AuthContext";

type UsePollDataRTN = UseEventItemDataHookRTN<ClientPollDocument> & {
  getVoteCountForOption: (optionId: string) => number;
};
export const usePollData = ({
  eventId,
  pollId,
}: {
  eventId: string;
  pollId: string;
}) => {
  const {
    data: parentEventData,
    expired: parentExpired,
    canEdit,
  } = useEventData({
    eventId,
  });

  const [fetching, setFetching] = useState<UsePollDataRTN["fetching"]>(true);
  const [data, setData] = useState<UsePollDataRTN["data"]>();

  const getData = async () => {
    setFetching(true);
    try {
      const poll = (await getEventItem(
        eventId,
        pollId,
      )) as unknown as PollRootDocument;

      const nextData: UsePollDataRTN["data"] = {
        ...poll,
        type: "poll",
        id: pollId,
        options: [],
        voters: [],
      };

      const pollOptions = await getPollOptions(eventId, pollId);
      if (pollOptions) nextData.options = pollOptions;

      const pollVoters = await getPollVoters(eventId, pollId);
      if (pollVoters) nextData.voters = pollVoters;

      setData(nextData);
    } catch (e) {
      console.log("usePollData getData error", e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    void getData();
  }, [pollId, eventId]);

  const getVoteCountForOption: UsePollDataRTN["getVoteCountForOption"] =
    useCallback(
      (optionId) => {
        if (!data || !data.voters) return 0;

        return data.voters.reduce((count, voter) => {
          if (voter.optionId === optionId) return ++count;

          return count;
        }, 0);
      },
      [data],
    );

  const expired = useMemo(() => {
    if (!data) return false;

    return hasExpired(data.expiry.toDate());
  }, [data]);
  const willExpireSoon = useMemo(() => {
    if (!data || expired) return false;

    return expiresSoon(data.expiry.toDate());
  }, [data, expired]);

  return {
    fetching,
    data,

    expired,
    expiresSoon: willExpireSoon,

    getVoteCountForOption,

    parentEventData,
    parentExpired,

    canEdit,
  };
};

type UsePollMutationsRTN = {
  mutating: boolean;
  optionBeingMutated: string | undefined;

  voteForOption: (optionId: string) => Promise<string | undefined>;
};
export const usePollMutations = ({
  eventId,
  pollId,
}: {
  eventId: string;
  pollId: string;
}): UsePollMutationsRTN => {
  const session = useSession();
  const [mutating, setMutating] =
    useState<UsePollMutationsRTN["mutating"]>(false);
  const [optionBeingMutated, setOptionBeingMutated] =
    useState<UsePollMutationsRTN["optionBeingMutated"]>(undefined);

  const voteForOption: UsePollMutationsRTN["voteForOption"] = useCallback(
    async (optionId) => {
      setMutating(true);
      setOptionBeingMutated(optionId);

      let voteId = undefined;
      try {
        voteId = await voteForPollOption(
          eventId,
          pollId,
          optionId,
          session.userId!,
        );
      } catch (e) {
        console.log("usePollMutations voteForOption error", e);
      } finally {
        setMutating(false);
        setOptionBeingMutated(undefined);
      }

      return voteId;
    },
    [eventId, pollId, setMutating],
  );

  return {
    mutating,
    optionBeingMutated,

    voteForOption,
  };
};
