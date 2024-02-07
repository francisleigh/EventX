import { PageContainer } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { useLocalSearchParams } from "expo-router";
import { NewPollOptionForm } from "~/components/forms/NewPollOption";

export default function NewPollOptionPage() {
  const params = useLocalSearchParams();

  return (
    <PageContainer edges={["bottom", "left", "right"]}>
      <Text.H1>New Poll Option</Text.H1>
      <NewPollOptionForm
        eventId={params.eventId as string}
        pollId={params.pollId as string}
      />
    </PageContainer>
  );
}
