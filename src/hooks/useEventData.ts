import { ClientEventDocument } from "~/types.client";
import { useEffect, useMemo, useState } from "react";
import { getEvent, getEventItems } from "~/db";
import { UseEventItemDataHookRTN } from "~/types.hooks";
import { expiresSoon, hasExpired } from "~/util";
import { temp_userid } from "~/tempuser";

type RTN = Omit<
  UseEventItemDataHookRTN<ClientEventDocument>,
  "parentEventData" | "parentExpired"
> & {};

export const useEventData = ({ eventId }: { eventId: string }) => {
  const [fetching, setFetching] = useState<RTN["fetching"]>(true);
  const [data, setData] = useState<RTN["data"]>();

  const getData = async () => {
    setFetching(true);
    try {
      const event = await getEvent(eventId);
      if (!event) return;

      const eventItems = await getEventItems(eventId);

      console.log("EVENT ITEMS", eventItems);

      const eventData: RTN["data"] = {
        id: eventId,
        ...event,
        polls: [],
        bills: [],
        lists: [],
      };

      eventItems.forEach((item) => {
        switch (item.type) {
          case "poll":
            eventData.polls!.push(item);
            break;
          case "bill":
            eventData.bills!.push(item);
            break;
          case "list":
            eventData.lists!.push(item);
            break;
        }
      });

      setData(eventData);
    } catch (e) {
      console.log("useEventData getData error", e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    void getData();
  }, [eventId]);

  const expired = useMemo(() => {
    if (!data?.end) return false;

    return hasExpired(data.end.toDate());
  }, [data]);
  const willExpireSoon = useMemo(() => {
    if (!data?.end || expired) return false;

    return expiresSoon(data.end.toDate());
  }, [data, expired]);

  const canEdit = useMemo(() => data?.owner === temp_userid, [data]);

  return {
    fetching,
    data,

    expired,
    expiresSoon: willExpireSoon,

    canEdit,
  };
};
