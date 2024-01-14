import { PageContainer } from "~/components/core/Layout";
import { Poll } from "~/components/app/Poll";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { colors } from "~/constants/colors";
import { getTempDBEntry } from "~/tempdb";

export default function PollPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fetchingEntry, setFetchingEntry] = useState<boolean>(true);
  const [data, setData] = useState<Parameters<typeof Poll>[0]>();

  useEffect(() => {
    if (!params.id) {
      router.back();
    } else {
      getTempDBEntry("polls", params.id as string)
        .then(setData)
        .finally(() => setFetchingEntry(false));
    }
  }, [params, router.back]);

  return (
    <PageContainer edges={["bottom", "left", "right"]}>
      {fetchingEntry ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Poll {...data} view={"full"} onItemPress={console.log} />
      )}
    </PageContainer>
  );
}
