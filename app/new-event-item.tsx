import { PageContainer } from "~/components/core/Layout";
import { NewEventItemForm } from "~/components/forms/NewEventItem";
import { Text } from "~/components/core/Text";
import { useLocalSearchParams } from "expo-router";

export default function NewEventItemPage() {
  const params = useLocalSearchParams();

  return (
    <PageContainer edges={["bottom", "left", "right"]}>
      <Text.H1>New Event Item</Text.H1>
      <NewEventItemForm eventId={params.eventId as string} />
    </PageContainer>
  );
}
