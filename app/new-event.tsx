import { PageContainer } from "~/components/core/Layout";
import { NewEventForm } from "~/components/forms/NewEvent";
import { Text } from "~/components/core/Text";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { getEvent } from "~/db";
import { Loading } from "~/components/app/Loading";
import { EventSchemaType } from "~/types.schema";

export default function NewEventPage() {
  const { eventId } = useLocalSearchParams();

  const [loadingExistingEventData, setLoadingExistingEventData] =
    useState<boolean>(false);
  const [existingEventData, setExistingEventData] = useState<
    EventSchemaType | undefined
  >(undefined);

  useEffect(() => {
    if (eventId) {
      setLoadingExistingEventData(true);
      getEvent(eventId as string)
        .then((event) => {
          if (event)
            setExistingEventData({
              ...event,
              end: event.end?.toDate(),
              start: event.start?.toDate(),
            });
        })
        .finally(() => setLoadingExistingEventData(false));
    }
  }, [eventId, setLoadingExistingEventData]);

  return (
    <PageContainer edges={["bottom", "left", "right"]}>
      <Text.H1>{eventId ? "Edit event" : "New event"}</Text.H1>
      {loadingExistingEventData ? (
        <Loading />
      ) : (
        <NewEventForm
          eventId={eventId as string}
          defaultValues={existingEventData}
        />
      )}
    </PageContainer>
  );
}
