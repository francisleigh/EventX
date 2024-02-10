import { PageContainer } from "~/components/core/Layout";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Event } from "~/components/app/Event";
import { useFocusReload } from "~/hooks/useFocusReload";

export default function EventPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { reloadKey } = useFocusReload();

  if (!params.id) {
    router.back();
    return null;
  }

  return (
    <PageContainer>
      <Event key={reloadKey} view={"full"} eventId={params.id as string} />
    </PageContainer>
  );
}
