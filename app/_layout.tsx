import { Slot, useNavigationContainerRef } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import { SessionProvider } from "~/ctx/AuthContext";

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();

  useReactNavigationDevTools(navigationRef);
  return (
    <SessionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Slot />
      </GestureHandlerRootView>
    </SessionProvider>
  );
}
