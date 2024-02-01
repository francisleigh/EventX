import { EventSchemaType } from "~/types.schema";
import { firestore } from "~/backend";
import { addDoc, collection, doc, getDoc } from "@firebase/firestore";
import { ClientEventDocument } from "~/types.client";
import {
  BillRootDocument,
  EventDocument,
  ListRootDocument,
  PollRootDocument,
} from "~/types.firestore";

export const createNewEvent = async (data: EventSchemaType) => {
  const ref = collection(firestore, "events");
  const docRef = await addDoc(ref, data);

  return docRef.id;
};

export const getEvent = async (
  eventId: ClientEventDocument["id"],
): Promise<EventDocument> => {
  const ref = doc(collection(firestore, "events"), eventId);
  const event = await getDoc(ref);

  return event.data() as EventDocument;
};

export const getEventItems = async (
  eventId: ClientEventDocument["id"],
): Promise<(PollRootDocument | BillRootDocument | ListRootDocument)[]> => {
  return [];
};
