import { PageContainer } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { useLocalSearchParams } from "expo-router";
import { NewBillPaymentForm } from "~/components/forms/BillPayment";

export default function NewBillPaymentPage() {
  const params = useLocalSearchParams();

  return (
    <PageContainer type={"modal"}>
      <Text.H1>New Bill Payment</Text.H1>
      <NewBillPaymentForm
        eventId={params.eventId as string}
        billId={params.billId as string}
      />
    </PageContainer>
  );
}
