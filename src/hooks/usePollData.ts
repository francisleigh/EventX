import { ClientPollDocument } from "~/types.client";
import { useCallback, useEffect, useState } from "react";
import {
  getEventItem,
  getPollOptions,
  getPollVoters,
  voteForPollOption,
} from "~/db";
import { PollRootDocument } from "~/types.firestore";
import { temp_userid } from "~/tempuser";

type UsePollDataRTN = {
  fetching: boolean;
  data: ClientPollDocument;

  getVoteCountForOption: (optionId: string) => number;
};
export const usePollData = ({
  eventId,
  pollId,
}: {
  eventId: string;
  pollId: string;
}) => {
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

  return {
    fetching,
    data,

    getVoteCountForOption,
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
          temp_userid, // TODO: derive this from auth state
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
