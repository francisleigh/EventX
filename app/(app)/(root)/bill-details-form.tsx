import { PageContainer } from "~/components/core/Layout";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePreLoadFormData } from "~/hooks/usePreLoadFormData";
import { Loading } from "~/components/app/Loading";
import { getEventItem } from "~/db";
import { Text } from "~/components/core/Text";
import { BillPaymentDetailsForm } from "~/components/forms/BillDetails";
import { BillRootDocument } from "~/types.firestore";
import { BillPaymentDetailsSchemaType } from "~/types.schema";

export default function BillPaymentDetailsPage() {
  const router = useRouter();
  const { id, eventId } = useLocalSearchParams();
  const { preLoadingFormData, data } =
    usePreLoadFormData<BillPaymentDetailsSchemaType>(
      {
        query: async () => {
          if (!eventId || !id) return undefined;

          const bill = (await getEventItem(
            eventId as string,
            id as string,
          )) as unknown as BillRootDocument;
          if (bill.totalOwed) {
            return {
              totalOwed: bill.totalOwed,
              accountNumber: bill.accountNumber,
              accountPayeeName: bill.accountPayeeName,
              sortCode: bill.sortCode,
            };
          }

          return undefined;
        },
      },
      [id, eventId],
    );

  if (!id || !eventId) {
    router.back();
    return null;
  }

  return (
    <PageContainer type={"modal"}>
      <Text.H1>Edit bill data</Text.H1>
      {preLoadingFormData ? (
        <Loading />
      ) : (
        <BillPaymentDetailsForm
          eventId={eventId as string}
          billId={id as string}
          defaultValues={data}
        />
      )}
    </PageContainer>
  );
}
