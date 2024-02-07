import { PageContainer } from "~/components/core/Layout";
import { List } from "~/components/app/List";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ListPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  if (!params.id || !params.eventId) {
    router.back();
  }

  return (
    <PageContainer>
      <List
        view={"full"}
        eventId={params.eventId as string}
        listId={params.id as string}
        onItemPress={console.log}
      />
    </PageContainer>
  );
}
