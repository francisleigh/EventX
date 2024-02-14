import { PageContainer } from "~/components/core/Layout";
import { List } from "~/components/app/List";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusReload } from "~/hooks/useFocusReload";

export default function ListPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { reloadKey, invalidate } = useFocusReload();

  if (!params.id || !params.eventId) {
    router.back();
  }

  return (
    <PageContainer>
      <List
        key={reloadKey}
        view={"full"}
        eventId={params.eventId as string}
        listId={params.id as string}
        onRefetchData={invalidate}
      />
    </PageContainer>
  );
}
