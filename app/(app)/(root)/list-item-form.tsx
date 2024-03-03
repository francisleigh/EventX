import { PageContainer } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { useLocalSearchParams } from "expo-router";
import { NewListItemForm } from "~/components/forms/ListItem";

export default function NewListItemPage() {
  const params = useLocalSearchParams();

  return (
    <PageContainer type={"modal"}>
      <Text.H1>New List Item</Text.H1>
      <NewListItemForm
        eventId={params.eventId as string}
        listId={params.listId as string}
      />
    </PageContainer>
  );
}
