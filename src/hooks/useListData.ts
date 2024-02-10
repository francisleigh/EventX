import { ClientListDocument } from "~/types.client";
import { useEffect, useMemo, useState } from "react";
import { getList, getListItems } from "~/tempdb";
import { UseEventItemDataHookRTN } from "~/types.hooks";
import { expiresSoon, hasExpired } from "~/util";

type RTN = UseEventItemDataHookRTN<ClientListDocument> & {};
export const useListData = ({
  eventId,
  listId,
}: {
  eventId: string;
  listId: string;
}) => {
  const [fetching, setFetching] = useState<RTN["fetching"]>(true);
  const [data, setData] = useState<RTN["data"]>();

  const getData = async () => {
    setFetching(true);
    try {
      const bill = await getList(eventId, listId);

      const nextData: RTN["data"] = {
        ...bill,
        type: "list",
        id: listId,
        items: [],
      };

      const listItems = await getListItems(listId);
      if (listItems)
        nextData.items = Object.entries(listItems).map(
          ([itemId, listItem]) => ({ id: itemId, ...listItem }),
        );

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
  };
};
