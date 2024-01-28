import { ClientListDocument } from "~/types.client";
import { useEffect, useState } from "react";
import { getList, getListItems } from "~/tempdb";

type RTN = {
  fetching: boolean;
  data: ClientListDocument;
};
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

  return {
    fetching,
    data,
  };
};
