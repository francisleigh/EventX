import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ header: () => null }} />
      <Stack.Screen
        name="details"
        options={{
          header: () => null,
          presentation: "modal",
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
  );
}
