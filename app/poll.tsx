import { PageContainer } from "~/components/core/Layout";
import { Poll } from "~/components/app/Poll";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export default function PollPage() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const [reloadToggle, setReloadToggle] = useState<number>(0);

  const handleReload = useCallback(() => {
    setReloadToggle((v) => (!!v ? 0 : 1));
  }, [setReloadToggle]);

  /*
   * handles reloading of state on focus, e.g after new option added
   * */
  useEffect(() => {
    navigation.addListener("focus", handleReload);

    return () => {
      navigation.removeListener("focus", handleReload);
    };
  }, [setReloadToggle, navigation]);

  if (!params.id || !params.eventId) {
    router.back();
    return null;
  }

  return (
    <PageContainer>
      <Poll
        key={reloadToggle}
        view={"full"}
        eventId={params.eventId as string}
        pollId={params.id as string}
        onOptionPress={console.log}
      />
    </PageContainer>
  );
}
