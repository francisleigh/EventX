import { ClientPollDocument } from "~/types.client";
import { useCallback, useEffect, useState } from "react";
import { getPoll, getPollOptions, getPollVoters } from "~/tempdb";
import { getEventItem } from "~/db";
import { PollRootDocument } from "~/types.firestore";

type RTN = {
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
  const [fetching, setFetching] = useState<RTN["fetching"]>(true);
  const [data, setData] = useState<RTN["data"]>();

  const getData = async () => {
    setFetching(true);
    try {
      const poll = (await getEventItem(
        eventId,
        pollId,
      )) as unknown as PollRootDocument;

      console.log("poll beth", poll);

      const nextData: RTN["data"] = {
        ...poll,
        type: "poll",
        id: pollId,
        options: [],
        voters: [],
      };

      // const pollOptions = await getPollOptions(pollId);
      // if (pollOptions)
      //   nextData.options = Object.entries(pollOptions).map(
      //     ([optionId, option]) => ({ id: optionId, ...option }),
      //   );
      //
      // const pollVoters = await getPollVoters(pollId);
      // if (pollVoters)
      //   nextData.voters = Object.entries(pollVoters).flatMap(
      //     ([optionId, votes]) => {
      //       return Object.entries(votes).map(([voteId, vote]) => ({
      //         optionId,
      //         id: voteId,
      //         userId: vote.userId,
      //       }));
      //     },
      //   );

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

  const getVoteCountForOption: RTN["getVoteCountForOption"] = useCallback(
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
