import { ClientListDocument } from "~/types.client";
import { useEffect, useMemo, useState } from "react";
import { UseEventItemDataHookRTN } from "~/types.hooks";
import { expiresSoon, hasExpired } from "~/util";
import { useEventData } from "~/hooks/useEventData";
import { getEventItem, getListItems } from "~/db";
import { Timestamp } from "@react-native-firebase/firestore/lib/modular/Timestamp";

type RTN = UseEventItemDataHookRTN<ClientListDocument> & {};
export const useListData = ({
  eventId,
  listId,
}: {
  eventId: string;
  listId: string;
}) => {
  const {
    data: parentEventData,
    expired: parentExpired,
    canEdit,
  } = useEventData({
    eventId,
  });

  const [fetching, setFetching] = useState<RTN["fetching"]>(true);
  const [data, setData] = useState<RTN["data"]>();

  const getData = async () => {
    setFetching(true);
    try {
      const list = await getEventItem(eventId, listId);

      const nextData: RTN["data"] = {
        ...list,
        type: "list",
        id: listId,
        items: [],
      };

      const listItems = await getListItems(eventId, listId);
      if (listItems) nextData.items = listItems;

      setData(nextData);
    } catch (e) {
      console.log("useListData getData error", e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    void getData();
  }, [listId, eventId]);

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

    parentEventData,
    parentExpired,

    canEdit,
  };
};
