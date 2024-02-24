import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ header: () => null }} />

        <Stack.Screen
          name="message-thread"
          options={{
            header: () => null,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="event-form"
          options={{
            header: () => null,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="event-item-form"
          options={{
            header: () => null,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="poll-option-form"
          options={{
            header: () => null,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="bill-details-form"
          options={{
            header: () => null,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="bill-payment-form"
          options={{
            header: () => null,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="list-item-form"
          options={{
            header: () => null,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="list-item-controls"
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
          }}
        />
        <Stack.Screen
          name="poll"
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="bill"
          options={{
            header: () => null,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
