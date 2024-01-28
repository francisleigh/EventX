import { PageContainer } from "~/components/core/Layout";
import { NewEventForm } from "~/components/forms/NewEvent";

export default function NewEventPage() {
  return (
    <PageContainer edges={["bottom", "left", "right"]}>
      <NewEventForm />
    </PageContainer>
  );
}
