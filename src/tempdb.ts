import {
  BillPaymentDocument,
  BillRootDocument,
  EventDocument,
  ListItemDocument,
  ListRootDocument,
  PollOptionDocument,
  PollRootDocument,
  PollVoterDocument,
  ClientPollDocument,
} from "~/types.firestore";
import { Timestamp } from "@react-native-firebase/firestore/lib/modular/Timestamp";
import { ClientBillDocument, ClientListDocument } from "~/types.client";

export type EventsDb = {
  [key in string]: EventDocument;
};
export type EventItemsDb = {
  [key in string]: {
    [key in string]: BillRootDocument | ListRootDocument | PollRootDocument;
  };
};
export type PollItemsDB = {
  [key in string]: {
    [key in string]: PollOptionDocument;
  };
};
export type PollVotersDB = {
  [key in string]: {
    [key in string]: {
      [key in string]: PollVoterDocument;
    };
  };
};
export type BillPaymentsDb = {
  [key in string]: {
    [key in string]: BillPaymentDocument;
  };
};
export type ListItemsDb = {
  [key in string]: {
    [key in string]: ListItemDocument;
  };
};

const eventsDb: EventsDb = {
  event_1: {
    title: "Holiday 2024",
    description: `Where shall we go this year, last year we had no baby & now we do 😉`,
    start: Timestamp.now(),
    end: Timestamp.now(),
    created: Timestamp.now(),
  },
};
const eventItemsDb: EventItemsDb = {
  event_1: {
    1: {
      type: "poll",
      title: "Where shall we go?",
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.`,
      created: Timestamp.now(),
      expiry: Timestamp.now(),
    },
    2: {
      type: "bill",
      title: "AirBnB money",
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.`,
      created: Timestamp.now(),
      expiry: Timestamp.now(),
      totalOwed: 3500,
      currency: "GBP",
    },
    3: {
      type: "list",
      title: "Shopping List",
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.`,
      created: Timestamp.now(),
      expiry: Timestamp.now(),
    },
  },
};
export const getEvents = (): Promise<typeof eventsDb> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(eventsDb);
    }, 500);
  });
};
export const getEvent = (
  eventId: string,
): Promise<(typeof eventsDb)[string]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(eventsDb[eventId]);
    }, 500);
  });
};
export const getEventItems = (
  eventId: keyof typeof eventsDb,
): Promise<(typeof eventItemsDb)[string]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(eventItemsDb[eventId]);
    }, 300);
  });
};
export const getEventItem = async (
  eventId: string,
  itemId: string,
): Promise<(typeof eventItemsDb)[string][string]> => {
  const items = await getEventItems(eventId);

  return items[itemId];
};

const pollItemsDb: PollItemsDB = {
  1: {
    "1_1": {
      label: "Same as 2023",
      link: `https://www.vrbo.com/1234abc`,
    },
    "1_2": {
      label: "Umbrian Castle",
      link: `https://www.vrbo.com/abcd1`,
    },
    "1_3": {
      label: "Tenerife Villa",
      link: `https://www.vrbo.com/abcd1`,
    },
  },
};
const pollVotersDb: PollVotersDB = {
  1: {
    "1_1": {
      "1_1_1": {
        userId: "123abc",
      },
      "1_1_2": {
        userId: "234abc",
      },
      "1_1_3": {
        userId: "345abc",
      },
      "1_1_4": {
        userId: "456abc",
      },
    },
    "1_2": {
      "1_2_1": {
        userId: "567abc",
      },
      "1_2_2": {
        userId: "678abc",
      },
    },
    "1_3": {
      "1_3_1": {
        userId: "789abc",
      },
      "1_3_2": {
        userId: "890abc",
      },
    },
  },
};
export const getPollOptions = (
  pollId: string,
): Promise<(typeof pollItemsDb)[string]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(pollItemsDb[pollId]);
    }, 300);
  });
};
export const getPollVoters = (
  pollId: string,
): Promise<(typeof pollVotersDb)[string]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(pollVotersDb[pollId]);
    }, 400);
  });
};
export const getPoll = async (
  eventId: string,
  pollId: string,
): Promise<ClientPollDocument> => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const eventItems = eventItemsDb[eventId];
      if (eventItems) {
        const poll = eventItems[pollId];
        if (poll) {
          res(poll);
        } else {
          rej(`Could not find poll item from id ${pollId}`);
        }
      } else {
        rej(`Could not find event items from id ${eventId}`);
      }
    }, 300);
  });
};

const billPaymentsDb: BillPaymentsDb = {
  2: {
    "2_1": {
      userId: "123abc",
      quantity: 500,
    },
    "2_2": {
      userId: "234abc",
      quantity: 180,
    },
    "2_3": {
      userId: "345abc",
      quantity: 105,
    },
    "2_4": {
      userId: "456abc",
      quantity: 1000,
    },
    "2_5": {
      userId: "789abc",
      quantity: 600,
    },
  },
};
export const getBillPayments = (
  billId: string,
): Promise<(typeof billPaymentsDb)[string]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(billPaymentsDb[billId]);
    }, 700);
  });
};

export const getBill = async (
  eventId: string,
  billId: string,
): Promise<ClientBillDocument> => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const eventItems = eventItemsDb[eventId];
      if (eventItems) {
        const bill = eventItems[billId];
        if (bill) {
          res(bill);
        } else {
          rej(`Could not find bill item from id ${billId}`);
        }
      } else {
        rej(`Could not find event items from id ${eventId}`);
      }
    }, 300);
  });
};

const listItemsDb: ListItemsDb = {
  3: {
    "3_1": {
      title: "Cucumber",
      quantity: 8,
      status: "pending",
    },
    "3_2": {
      title: "Aubergine",
      quantity: 4,
      status: "pending",
    },
    "3_3": {
      title: "Sweets",
      quantity: 2,
      status: "done",
      userId: "345abc",
    },
    "3_4": {
      title: "Water",
      quantity: 24,
      status: "done",
    },
    "3_5": {
      userId: "789abc",
      title: "Red Wine",
      quantity: 30,
      status: "pending",
    },
  },
};
export const getListItems = (
  listId: string,
): Promise<(typeof listItemsDb)[string]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(listItemsDb[listId]);
    }, 500);
  });
};

export const getList = async (
  eventId: string,
  listId: string,
): Promise<ClientListDocument> => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const eventItems = eventItemsDb[eventId];
      if (eventItems) {
        const list = eventItems[listId];
        if (list) {
          res(list);
        } else {
          rej(`Could not find list item from id ${listId}`);
        }
      } else {
        rej(`Could not find event items from id ${eventId}`);
      }
    }, 300);
  });
};
