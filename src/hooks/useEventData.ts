import { ClientEventDocument } from "~/types.client";
import { useEffect, useState } from "react";
import { getEvent, getEventItems } from "~/tempdb";

type RTN = {
  fetching: boolean;
  data: ClientEventDocument;
};

export const useEventData = ({ eventId }: { eventId: string }) => {
  const [fetching, setFetching] = useState<RTN["fetching"]>(true);
  const [data, setData] = useState<RTN["data"]>();

  const getData = async () => {
    setFetching(true);
    try {
      const event = await getEvent(eventId);
      const eventItems = await getEventItems(eventId);

      const eventData: RTN["data"] = {
        id: eventId,
        ...event,
        polls: [],
        bills: [],
        lists: [],
      };

      Object.entries(eventItems).forEach(([itemId, item]) => {
        switch (item.type) {
          case "poll":
            eventData.polls!.push({ ...item, id: itemId });
            break;
          case "bill":
            eventData.bills!.push({ ...item, id: itemId });
            break;
          case "list":
            eventData.lists!.push({ ...item, id: itemId });
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

  return {
    fetching,
    data,
  };
};
