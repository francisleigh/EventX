import { PageContainer } from "~/components/core/Layout";
import { NewEventItemForm } from "~/components/forms/NewEventItem";
import { Text } from "~/components/core/Text";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { EventItemSchemaType } from "~/types.schema";
import { getEventItem } from "~/db";
import { Loading } from "~/components/app/Loading";

export default function NewEventItemPage() {
  const { eventId, eventItemId } = useLocalSearchParams();

  const [loadingExistingEventItemData, setLoadingExistingEventItemData] =
    useState<boolean>(false);
  const [existingEventItemData, setExistingEventItemData] = useState<
    EventItemSchemaType | undefined
  >(undefined);

  useEffect(() => {
    if (eventId && eventItemId) {
      setLoadingExistingEventItemData(true);
      getEventItem(eventId as string, eventItemId as string)
        .then((eventItem) => {
          if (eventItem)
            setExistingEventItemData({
              ...eventItem,
            });
        })
        .finally(() => setLoadingExistingEventItemData(false));
    }
  }, [eventId, setLoadingExistingEventItemData]);

  return (
    <PageContainer edges={["bottom", "left", "right"]}>
      <Text.H1>{eventItemId ? "Edit event item" : "New event item"}</Text.H1>
      {loadingExistingEventItemData ? (
        <Loading />
      ) : (
        <NewEventItemForm
          eventId={eventId as string}
          eventItemId={eventItemId as string}
          defaultValues={existingEventItemData}
        />
      )}
    </PageContainer>
  );
}
