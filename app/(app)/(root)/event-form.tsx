import { PageContainer } from "~/components/core/Layout";
import { NewEventForm } from "~/components/forms/NewEvent";
import { Text } from "~/components/core/Text";
import { useLocalSearchParams } from "expo-router";
import { getEvent } from "~/db";
import { Loading } from "~/components/app/Loading";
import { EventSchemaType } from "~/types.schema";
import { usePreLoadFormData } from "~/hooks/usePreLoadFormData";
import { useSession } from "~/ctx/AuthContext";

export default function NewEventPage() {
  const session = useSession();
  const { eventId } = useLocalSearchParams();
  const { data, preLoadingFormData } = usePreLoadFormData<EventSchemaType>(
    {
      query: async () => {
        const event = await getEvent(eventId as string);
        if (event) {
          return {
            ...event,
            end: event.end?.toDate(),
            start: event.start?.toDate(),
          } as EventSchemaType;
        }

        return undefined;
      },
    },
    [eventId],
  );

  return (
    <PageContainer
      type={"modal"}
      scrollViewProps={{ nestedScrollEnabled: true }}
    >
      <Text.H1>{eventId ? "Edit event" : "New event"}</Text.H1>
      {preLoadingFormData ? (
        <Loading />
      ) : (
        <NewEventForm
          eventId={eventId as string}
          defaultValues={data}
          userId={session.userId!}
        />
      )}
    </PageContainer>
  );
}
