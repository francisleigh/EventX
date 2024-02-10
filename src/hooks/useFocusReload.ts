import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "expo-router";

type RTN = {
  reloadKey: number;
  invalidate: () => any;
};
export const useFocusReload = (): RTN => {
  const navigation = useNavigation();

  const [reloadKey, setReloadKey] = useState<RTN["reloadKey"]>(0);

  const handleReload: RTN["invalidate"] = useCallback(() => {
    setReloadKey((v) => (!!v ? 0 : 1));
  }, [setReloadKey]);

  /*
   * handles reloading of state on focus
   * */
  useEffect(() => {
    navigation.addListener("focus", handleReload);

    return () => {
      navigation.removeListener("focus", handleReload);
    };
  }, [setReloadKey, navigation]);

  return { reloadKey, invalidate: handleReload };
};
