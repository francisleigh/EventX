import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

type Timestamp = FirebaseFirestoreTypes.Timestamp;
export type EventItemType = "poll" | "list" | "bill";

/**
 * @description All event item documents have this.
 * */
export type EventItemBase = {
  type: EventItemType;
  title: string;
  description?: string;

  created: Timestamp;
  updated?: Timestamp;
  expiry?: Timestamp;

  threadId?: string;
};

/**
 * @description Event item (parent)
 * */
export type EventDocument = {
  start: Timestamp;
  end: Timestamp;
} & Pick<
  EventItemBase,
  "title" | "description" | "created" | "updated" | "threadId"
>;

/**
 * @description Poll type items
 * */
export type PollOptionDocument = {
  label: string;
  link?: string;
};
export type PollVoterDocument = {
  userId: string;
};
export type PollRootDocument = {
  type: "poll";
} & EventItemBase;

/**
 * @description Bill type items
 * */
export type BillPaymentDocument = {
  userId: string;
  quantity: number;
};
export type BillRootDocument = {
  type: "bill";

  totalOwed: number;
  currency: string;
} & EventItemBase;

/**
 * @description List type items
 * */
export type ListItemDocument = {
  userId?: string;

  title: string;
  quantity?: number;

  status: "pending" | "done";
};
export type ListRootDocument = {
  type: "list";
} & EventItemBase;
