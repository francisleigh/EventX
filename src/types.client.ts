import {
  BillPaymentDocument,
  BillRootDocument,
  EventDocument,
  EventItemBase,
  ListItemDocument,
  ListRootDocument,
  PollOptionDocument,
  PollRootDocument,
  PollVoterDocument,
} from "~/types.firestore";

type WithID<T extends {}> = T & { id: string };

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
