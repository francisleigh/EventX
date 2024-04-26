import {
  ClientBillDocument,
  ClientListDocument,
  ClientPollDocument,
} from "~/types.client";
import { useEffect, useState } from "react";
import { UseEventItemDataHookRTN } from "~/types.hooks";
import { useEventData } from "~/hooks/useEventData";
import { getEventItem } from "~/db";

type GenericEventItems = Omit<
  ClientListDocument | ClientPollDocument | ClientBillDocument,
  "type" | "expiry" | "threadId"
>;

type RTN = Pick<
  UseEventItemDataHookRTN<GenericEventItems>,
  "data" | "fetching"
> & {};
export const useEventItemData = ({
  eventId,
  eventItemId,
}: {
  eventId: string;
  eventItemId?: string;
}) => {
  const [fetching, setFetching] = useState<RTN["fetching"]>(true);
  const [data, setData] = useState<RTN["data"]>();

  const getData = async () => {
    setFetching(true);

    if (!eventItemId) {
      setFetching(false);
      return;
    }

    try {
      const eventItem = await getEventItem(eventId, eventItemId);
      console.log("eventItem", eventItem);
      const nextData: RTN["data"] = {
        ...eventItem,
        id: eventItemId,
      };

      setData(nextData);
    } catch (e) {
      console.log("useEventItemData getData error", e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    void getData();
  }, [eventItemId, eventId]);

  return {
    fetching,
    data,
  };
};
