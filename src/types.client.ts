import {
  BillPaymentDocument,
  BillRootDocument,
  EventDocument,
  ListItemDocument,
  ListRootDocument,
  MessageDocument,
  MessageThreadRootDocument,
  PollOptionDocument,
  PollRootDocument,
  PollVoterDocument,
} from "~/types.firestore";

export type WithID<T extends {}> = T & { id: string };

export type ClientEventDocument = WithID<
  {
    polls: WithID<PollRootDocument>[];
    bills: WithID<BillRootDocument>[];
    lists: WithID<ListRootDocument>[];
  } & EventDocument
>;

export type ClientPollDocument = WithID<
  {
    options: WithID<PollOptionDocument>[];
    voters: WithID<PollVoterDocument & { optionId: string }>[];
  } & PollRootDocument
>;

export type ClientBillDocument = WithID<
  {
    payments: WithID<BillPaymentDocument>[];
  } & BillRootDocument
>;

export type ClientListDocument = WithID<
  {
    items: WithID<ListItemDocument>[];
  } & ListRootDocument
>;

export type ClientMessageThreadDocument = WithID<
  {
    messages: WithID<
      { createdAt: Date } & Omit<MessageDocument, "createdAt">
    >[];
    createdAt: Date;
    updatedAt: Date;
  } & Omit<MessageThreadRootDocument, "updatedAt" | "createdAt">
>;
