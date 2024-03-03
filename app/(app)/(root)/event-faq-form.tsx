import { PageContainer } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { useLocalSearchParams } from "expo-router";
import { EventItemSchemaType } from "~/types.schema";
import { getFAQItem } from "~/db";
import { Loading } from "~/components/app/Loading";
import { usePreLoadFormData } from "~/hooks/usePreLoadFormData";
import { NewFAQForm } from "~/components/forms/FAQItem";

export default function EventFAQFormPage() {
  const { eventId, id } = useLocalSearchParams();
  const { data, preLoadingFormData } = usePreLoadFormData<EventItemSchemaType>(
    {
      query: async () => {
        if (id) {
          const faqItem = await getFAQItem(eventId as string, id as string);

          return { ...faqItem };
        }

        return undefined;
      },
    },
    [eventId, id],
  );

  console.log("form data", data);

  return (
    <PageContainer type={"modal"}>
      <Text.H1>{id ? "Edit FAQ item" : "New FAQ item"}</Text.H1>
      {preLoadingFormData ? (
        <Loading />
      ) : (
        <NewFAQForm
          eventId={eventId as string}
          faqId={id as string}
          defaultValues={data}
        />
      )}
    </PageContainer>
  );
}
