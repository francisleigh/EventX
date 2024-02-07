import { PageContainer } from "~/components/core/Layout";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Event } from "~/components/app/Event";
import { useCallback, useEffect, useState } from "react";

export default function EventPage() {
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

  if (!params.id) {
    router.back();
    return null;
  }

  return (
    <PageContainer>
      <Event key={reloadToggle} view={"full"} eventId={params.id as string} />
    </PageContainer>
  );
}
