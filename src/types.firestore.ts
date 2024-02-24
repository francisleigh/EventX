import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import {
  BillPaymentSchemaType,
  BillSchemaType,
  EventItemSchemaType,
  EventSchemaType,
  ListItemSchemaType,
  ListSchemaType,
  PollOptionSchemaType,
  PollSchemaType,
  PollVoterSchemaType,
} from "~/types.schema";

type Timestamp = FirebaseFirestoreTypes.Timestamp;

/**
 * @description All event item documents have this.
 * */
export type EventItemBase = {
  created: Timestamp;
  updated?: Timestamp;
  expiry?: Timestamp;

  threadId?: string;
} & EventItemSchemaType;

/**
 * @description Event item (parent)
 * */
export type EventDocument = {
  start?: Timestamp;
  end?: Timestamp;
} & Pick<
  EventItemBase,
  "title" | "description" | "created" | "updated" | "threadId"
> &
  Pick<EventSchemaType, "owner">;

/**
 * @description Poll type items
 * */
export type PollOptionDocument = {} & PollOptionSchemaType;
export type PollVoterDocument = {} & PollVoterSchemaType;
export type PollRootDocument = {
  type: "poll";
  expiry: Timestamp;
} & PollSchemaType;

/**
 * @description Bill type items
 * */
export type BillPaymentDocument = {
  userId: string;
} & BillPaymentSchemaType;

export type BillRootDocument = {
  type: "bill";
  expiry: Timestamp;
} & BillSchemaType;

/**
 * @description List type items
 * */
export type ListItemDocument = {
  userId?: string;
} & ListItemSchemaType;

export type ListRootDocument = {
  type: "list";
  expiry: Timestamp;
} & ListSchemaType;

/**
 * @description Message thread
 * */
export type MessageDocument = {
  userId: string;
  createdAt: Timestamp;
  body: string;
};

export type MessageThreadRootDocument = {
  eventId: string;
  eventItemId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
