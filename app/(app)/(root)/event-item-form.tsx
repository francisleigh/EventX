import { PageContainer } from "~/components/core/Layout";
import { NewEventItemForm } from "~/components/forms/NewEventItem";
import { Text } from "~/components/core/Text";
import { useLocalSearchParams } from "expo-router";
import { EventItemSchemaType } from "~/types.schema";
import { getEventItem } from "~/db";
import { Loading } from "~/components/app/Loading";
import { usePreLoadFormData } from "~/hooks/usePreLoadFormData";

export default function NewEventItemPage() {
  const { eventId, eventItemId } = useLocalSearchParams();
  const { data, preLoadingFormData } = usePreLoadFormData<EventItemSchemaType>(
    {
      query: async () => {
        const eventItem = await getEventItem(
          eventId as string,
          eventItemId as string,
        );

        return (
          { ...eventItem, expiry: eventItem?.expiry?.toDate() } ?? undefined
        );
      },
    },
    [eventId, eventItemId],
  );

  console.log("form data", data);

  return (
    <PageContainer
      type={"modal"}
      scrollViewProps={{ nestedScrollEnabled: true }}
    >
      <Text.H1>{eventItemId ? "Edit event item" : "New event item"}</Text.H1>
      {preLoadingFormData ? (
        <Loading />
      ) : (
        <NewEventItemForm
          eventId={eventId as string}
          eventItemId={eventItemId as string}
          defaultValues={data}
        />
      )}
    </PageContainer>
  );
}
