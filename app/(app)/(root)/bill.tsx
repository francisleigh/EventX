import { PageContainer } from "~/components/core/Layout";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Bill } from "~/components/app/Bill";
import { useFocusReload } from "~/hooks/useFocusReload";

export default function BillPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { reloadKey, invalidate } = useFocusReload();

  if (!params.id || !params.eventId) {
    router.back();
    return null;
  }

  return (
    <PageContainer>
      <Bill
        key={reloadKey}
        view={"full"}
        eventId={params.eventId as string}
        billId={params.id as string}
        onRefetchData={invalidate}
      />
    </PageContainer>
  );
}
