import { PageContainer } from "~/components/core/Layout";
import { Poll } from "~/components/app/Poll";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusReload } from "~/hooks/useFocusReload";

export default function PollPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { reloadKey, invalidate } = useFocusReload();

  if (!params.id || !params.eventId) {
    router.back();
    return null;
  }

  return (
    <PageContainer>
      <Poll
        key={reloadKey}
        view={"full"}
        eventId={params.eventId as string}
        pollId={params.id as string}
        onRefetchData={invalidate}
      />
    </PageContainer>
  );
}
