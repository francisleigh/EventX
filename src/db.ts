import {
  BillPaymentSchemaType,
  EventItemSchemaType,
  EventSchemaType,
  ListItemSchemaType,
  PollOptionSchemaType,
} from "~/types.schema";
import { firestore } from "~/backend";
import {
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  where,
} from "@firebase/firestore";
import { ClientEventDocument, WithID } from "~/types.client";
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
import { query } from "@firebase/database";

export const createNewEvent = async (data: EventSchemaType) => {
  const ref = collection(firestore, "events");
  const docRef = await addDoc(ref, data);

  return docRef.id;
};

export const updateExistingEvent = async (
  eventId: ClientEventDocument["id"],
  data: Partial<EventItemSchemaType>,
): Promise<void> => {
  console.log("update", eventId);
  console.log("update", data);
  const events = collection(firestore, "events");
  const ref = doc(events, eventId);

  await updateDoc(ref, data);
};

export const getEvents = async (userId: string) => {
  const q = query(
    collection(firestore, "events"),

    where("owner", "==", userId),
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    ...(doc.data() as EventDocument),
    id: doc.id,
  })) as ClientEventDocument[];
};

export const getEvent = async (eventId: ClientEventDocument["id"]) => {
  const ref = doc(collection(firestore, "events"), eventId);
  const event = await getDoc(ref);

  return event.data() as EventDocument;
};

type OneOfEventItemType =
  | PollRootDocument
  | BillRootDocument
  | ListRootDocument;
export const getEventItems = async (
  eventId: ClientEventDocument["id"],
): Promise<WithID<OneOfEventItemType>[]> => {
  const ref = collection(firestore, "events", eventId, "items");
  const docs = await getDocs(ref);

  if (docs.empty) return [];

  return docs.docs.map((d) => {
    const data = d.data() as OneOfEventItemType;
    return {
      ...data,
      id: d.id,
    };
  });
};

export const createEventItem = async (
  eventId: ClientEventDocument["id"],
  data: EventItemSchemaType,
): Promise<{ id: string; type: EventItemSchemaType["type"] }> => {
  const ref = collection(firestore, "events", eventId, "items");
  const docRef = await addDoc(ref, data);
  const doc = await getDoc(docRef);

  return { id: docRef.id, type: doc?.data()?.type };
};

export const updateExistingEventItem = async (
  eventId: ClientEventDocument["id"],
  eventItemId: string,
  data: Partial<EventItemSchemaType>,
): Promise<void> => {
  console.log("update event item", eventItemId);
  console.log("update event item", data);
  const events = collection(firestore, "events", eventId, "items");
  const ref = doc(events, eventItemId);

  await updateDoc(ref, data);
};

export const getEventItem = async (eventId: string, eventItemId: string) => {
  const docRef = doc(
    collection(firestore, "events", eventId, "items"),
    eventItemId,
  );
  const getDocReturn = await getDoc(docRef);

  return { ...(getDocReturn.data() as EventItemBase), id: getDocReturn.id };
};

export const getPollOptions = async (eventId: string, pollId: string) => {
  const ref = collection(
    firestore,
    "events",
    eventId,
    "items",
    pollId,
    "options",
  );
  const docs = await getDocs(ref);

  if (docs.empty) return [];

  return docs.docs.map((d) => {
    const data = d.data() as PollOptionDocument;
    return {
      ...data,
      id: d.id,
    };
  });
};

export const getPollVoters = async (eventId: string, pollId: string) => {
  const ref = collection(
    firestore,
    "events",
    eventId,
    "items",
    pollId,
    "voters",
  );
  const docs = await getDocs(ref);

  if (docs.empty) return [];

  return docs.docs.map((d) => {
    const data = d.data() as PollVoterDocument;
    return {
      ...data,
      id: d.id,
    };
  });
};
export const addOptionToPoll = async (
  eventId: string,
  pollId: string,
  data: PollOptionSchemaType,
) => {
  const ref = collection(
    firestore,
    "events",
    eventId,
    "items",
    pollId,
    "options",
  );
  const docRef = await addDoc(ref, data);

  return docRef.id;
};

export const voteForPollOption = async (
  eventId: string,
  pollId: string,
  optionId: string,
  userId: string,
) => {
  const ref = collection(
    firestore,
    "events",
    eventId,
    "items",
    pollId,
    "voters",
  );
  const existingVoterQuery = query(ref, where("userId", "==", userId));
  const existingVoterQuerySnapshot = await getDocs(existingVoterQuery);

  if (existingVoterQuerySnapshot.empty) {
    const newVoteRef = await addDoc(ref, {
      userId,
      optionId,
    } as PollVoterDocument);

    return newVoteRef.id;
  }

  const voterDoc = existingVoterQuerySnapshot.docs[0];
  const voterDocRef = voterDoc.ref;
  const voterDocData = voterDoc.data() as PollVoterDocument;
  if (voterDocData.optionId === optionId) {
    await deleteDoc(voterDocRef);

    return undefined;
  } else {
    await updateDoc(voterDocRef, {
      optionId,
    } as Partial<PollVoterDocument>);
  }

  return voterDocRef.id;
};

export const getBillPayments = async (eventId: string, billId: string) => {
  const ref = collection(
    firestore,
    "events",
    eventId,
    "items",
    billId,
    "payments",
  );
  const docs = await getDocs(ref);

  if (docs.empty) return [];

  return docs.docs.map((d) => {
    const data = d.data() as BillPaymentDocument;
    return {
      ...data,
      id: d.id,
    };
  });
};

export const addPaymentToBill = async (
  eventId: string,
  billId: string,
  data: BillPaymentSchemaType,
) => {
  const ref = collection(
    firestore,
    "events",
    eventId,
    "items",
    billId,
    "payments",
  );
  const docRef = await addDoc(ref, data);

  return docRef.id;
};

export const getListItems = async (eventId: string, listId: string) => {
  const ref = collection(
    firestore,
    "events",
    eventId,
    "items",
    listId,
    "items",
  );
  const docs = await getDocs(ref);

  if (docs.empty) return [];

  return docs.docs.map((d) => {
    const data = d.data() as ListItemDocument;
    return {
      ...data,
      id: d.id,
    };
  });
};

export const addItemToList = async (
  eventId: string,
  listId: string,
  data: ListItemSchemaType,
) => {
  const ref = collection(
    firestore,
    "events",
    eventId,
    "items",
    listId,
    "items",
  );
  const docRef = await addDoc(ref, data);

  return docRef.id;
};

export const assignUserToListItem = async (
  eventId: string,
  listId: string,
  listItemId: string,
  userId: string,
) => {
  const ref = collection(
    firestore,
    "events",
    eventId,
    "items",
    listId,
    "items",
  );
  const listItemDocRef = doc(ref, listItemId);
  const listItemDoc = await getDoc(listItemDocRef);
  if (listItemDoc.exists()) {
    const data = listItemDoc.data() as unknown as ListItemDocument;
    if (!!userId && !!data.userId) {
      throw new Error(`Item is already assigned.`);
    }

    await updateDoc(listItemDocRef, { userId } as Partial<ListItemDocument>);
  }

  return listItemDoc.id;
};

export const updateListItem = async (
  eventId: string,
  listId: string,
  listItemId: string,
  data: Partial<ListItemDocument>,
) => {
  const ref = collection(
    firestore,
    "events",
    eventId,
    "items",
    listId,
    "items",
  );
  const listItemDocRef = doc(ref, listItemId);
  const listItemDoc = await getDoc(listItemDocRef);

  if (listItemDoc.exists()) {
    await updateDoc(listItemDocRef, data);
  }

  return listItemDocRef.id;
};
