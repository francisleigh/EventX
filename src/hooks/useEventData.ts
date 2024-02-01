import { ClientEventDocument } from "~/types.client";
import { useEffect, useState } from "react";
import { getEvent, getEventItems } from "~/db";

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

  return {
    fetching,
    data,
  };
};
