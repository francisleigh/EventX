import { PageContainer } from "~/components/core/Layout";
import { List } from "~/components/app/List";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getTempDBEntry } from "~/tempdb";
import { ActivityIndicator } from "react-native";
import { colors } from "~/constants/colors";
import { Poll } from "~/components/app/Poll";

export default function ListPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fetchingEntry, setFetchingEntry] = useState<boolean>(true);
  const [data, setData] = useState<Parameters<typeof List>[0]>();

  useEffect(() => {
    if (!params.id) {
      router.back();
    } else {
      getTempDBEntry("lists", params.id as string)
        .then(setData)
        .finally(() => setFetchingEntry(false));
    }
  }, [params, router.back]);

  return (
    <PageContainer edges={["bottom", "left", "right"]}>
      {fetchingEntry ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <List {...data} view={"full"} onItemPress={console.log} />
      )}
    </PageContainer>
  );
}
