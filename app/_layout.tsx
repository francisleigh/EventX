import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ header: () => null }} />

        <Stack.Screen
          name="new-event"
          options={{
            header: () => null,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="new-event-item"
          options={{
            header: () => null,
            presentation: "modal",
          }}
        />

        <Stack.Screen
          name="event"
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="list"
          options={{
            header: () => null,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="poll"
          options={{
            header: () => null,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="bill"
          options={{
            header: () => null,
            presentation: "modal",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
