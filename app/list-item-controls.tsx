import { PageContainer } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ListItemControlsForm } from "~/components/forms/ListItemControls";
import { useFocusReload } from "~/hooks/useFocusReload";

export default function ListItemControlsPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { reloadKey, invalidate } = useFocusReload();

  if (!params.eventId || !params.listId || !params.id) {
    router.back();
    return null;
  }

  return (
    <PageContainer type={"modal"}>
      <Text.H1>List Item</Text.H1>
      <ListItemControlsForm
        key={reloadKey}
        eventId={params.eventId as string}
        listId={params.listId as string}
        listItemId={params.id as string}
        onRefetchData={invalidate}
      />
    </PageContainer>
  );
}
