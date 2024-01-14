import { PageContainer } from "~/components/core/Layout";
import { Bill } from "~/components/app/Bill";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getTempDBEntry } from "~/tempdb";
import { ActivityIndicator } from "react-native";
import { colors } from "~/constants/colors";
import { Button } from "~/components/core/Button";

export default function BillPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fetchingEntry, setFetchingEntry] = useState<boolean>(true);
  const [data, setData] = useState<Parameters<typeof Bill>[0]>();

  useEffect(() => {
    if (!params.id) {
      router.back();
    } else {
      getTempDBEntry("bills", params.id as string)
        .then(setData)
        .finally(() => setFetchingEntry(false));
    }
  }, [params, router.back]);

  return (
    <>
      <PageContainer edges={["bottom", "left", "right"]}>
        {fetchingEntry ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <Bill {...data} view={"full"} onItemPress={console.log} />
            <Button>Add payment</Button>
          </>
        )}
      </PageContainer>
    </>
  );
}
