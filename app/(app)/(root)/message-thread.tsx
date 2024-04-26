import { PageContainer } from "~/components/core/Layout";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MessageThread } from "~/components/app/MessageThread";

export default function MessageThreadPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  if (!params.id) {
    router.back();
  }

  return (
    <PageContainer
      type={"modal"}
      containerAs={"View"}
      scrollViewProps={{ nestedScrollEnabled: true }}
    >
      <MessageThread
        threadId={params.id as string}
        eventId={params.eventId as string}
        eventItemId={params.eventItemId as string | undefined}
      />
    </PageContainer>
  );
}
