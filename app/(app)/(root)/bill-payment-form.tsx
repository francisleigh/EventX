import { PageContainer } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { useLocalSearchParams } from "expo-router";
import { NewBillPaymentForm } from "~/components/forms/BillPayment";
import { useSession } from "~/ctx/AuthContext";

export default function NewBillPaymentPage() {
  const session = useSession();
  const params = useLocalSearchParams();

  return (
    <PageContainer type={"modal"}>
      <Text.H1>New Bill Payment</Text.H1>
      <NewBillPaymentForm
        eventId={params.eventId as string}
        billId={params.billId as string}
        userId={session.userId!}
      />
    </PageContainer>
  );
}
