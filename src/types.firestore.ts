import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import {
  BillPaymentSchemaType,
  BillSchemaType,
  EventSchemaType,
  ListItemSchemaType,
  ListSchemaType,
  PollOptionSchemaType,
  PollSchemaType,
  PollVoterSchemaType,
} from "~/types.schema";

type Timestamp = FirebaseFirestoreTypes.Timestamp;
export type EventItemType = "poll" | "list" | "bill";

/**
 * @description All event item documents have this.
 * */
export type EventItemBase = {
  created: Timestamp;
  updated?: Timestamp;
  expiry?: Timestamp;

  threadId?: string;
} & EventSchemaType;

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
export type PollOptionDocument = {} & PollOptionSchemaType;
export type PollVoterDocument = {} & PollVoterSchemaType;
export type PollRootDocument = {
  type: "poll";
} & PollSchemaType;

/**
 * @description Bill type items
 * */
export type BillPaymentDocument = {
  userId: string;
} & BillPaymentSchemaType;
export type BillRootDocument = {
  type: "bill";
} & BillSchemaType;

/**
 * @description List type items
 * */
export type ListItemDocument = {
  userId?: string;
} & ListItemSchemaType;
export type ListRootDocument = {
  type: "list";
} & ListSchemaType;
