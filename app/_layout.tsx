import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SessionProvider } from "~/ctx/AuthContext";

export default function RootLayout() {
  return (
    <SessionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Slot />
      </GestureHandlerRootView>
    </SessionProvider>
  );
}
