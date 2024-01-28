import {
  BillRootDocument,
  EventItemType,
  ListRootDocument,
  PollRootDocument,
} from "~/types.firestore";
import { tempdb } from "~/tempdb";

type EventItemDocumentMap = {
  poll: PollRootDocument;
  bill: BillRootDocument;
  list: ListRootDocument;
};

export type GetEventItemEntryReturnType<T extends EventItemType> =
  T extends keyof EventItemDocumentMap
    ? EventItemDocumentMap[T]
    : { error: string };

export const getEventItemEntry = <T extends EventItemType>(
  itemType: T,
  id: string,
): Promise<GetEventItemEntryReturnType<T>> => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (tempdb[itemType][id]) {
        res(tempdb[itemType][id]);
      } else {
        rej({ error: `No data found for ${itemType} ${id}` });
      }
    }, 600);
  });
};

export const getEventItems = (): Promise<typeof tempdb> => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(tempdb);
    }, 900);
  });
};
