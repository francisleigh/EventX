import { PageContainer } from "~/components/core/Layout";
import { NewEventForm } from "~/components/forms/NewEvent";
import { Text } from "~/components/core/Text";

export default function NewEventPage() {
  return (
    <PageContainer edges={["bottom", "left", "right"]}>
      <Text.H1>New Event</Text.H1>
      <NewEventForm />
    </PageContainer>
  );
}
