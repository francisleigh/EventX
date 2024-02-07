import {
  EventItemSchemaType,
  EventSchemaType,
  PollOptionSchemaType,
} from "~/types.schema";
import { firestore } from "~/backend";
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  getDoc,
  getDocs,
  where,
} from "@firebase/firestore";
import { ClientEventDocument, WithID } from "~/types.client";
import {
  BillRootDocument,
  EventDocument,
  ListRootDocument,
  PollOptionDocument,
  PollRootDocument,
} from "~/types.firestore";
import { query } from "@firebase/database";

export const createNewEvent = async (data: EventSchemaType) => {
  const ref = collection(firestore, "events");
  const docRef = await addDoc(ref, data);

  return docRef.id;
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
  }));
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

export const getEventItem = async (eventId: string, eventItemId: string) => {
  const docRef = doc(
    collection(firestore, "events", eventId, "items"),
    eventItemId,
  );
  const getDocReturn = await getDoc(docRef);

  return { ...getDocReturn.data(), id: getDocReturn.id };
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
