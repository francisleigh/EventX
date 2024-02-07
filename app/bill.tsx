import { PageContainer } from "~/components/core/Layout";
import { Bill } from "~/components/app/Bill";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "~/components/core/Button";

export default function BillPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  if (!params.id || !params.eventId) {
    router.back();
    return null;
  }

  return (
    <>
      <PageContainer>
        <Bill
          view={"full"}
          eventId={params.eventId as string}
          billId={params.id as string}
          onItemPress={console.log}
        />
        <Button>Add payment</Button>
      </PageContainer>
    </>
  );
}
