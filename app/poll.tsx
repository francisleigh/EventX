import { PageContainer } from "~/components/core/Layout";
import { Poll } from "~/components/app/Poll";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function PollPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  if (!params.id || !params.eventId) {
    router.back();
    return null;
  }

  return (
    <PageContainer edges={["bottom", "left", "right"]}>
      <Poll
        view={"full"}
        eventId={params.eventId as string}
        pollId={params.id as string}
        onItemPress={console.log}
      />
    </PageContainer>
  );
}
