import { PageContainer } from "~/components/core/Layout";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Event } from "~/components/app/Event";

export default function EventPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  if (!params.id) {
    router.back();
    return null;
  }

  return (
    <PageContainer>
      <Event view={"full"} eventId={params.id as string} />
    </PageContainer>
  );
}
