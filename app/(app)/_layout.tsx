import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(root)",
};

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(root)" options={{ header: () => null }} />
      <Stack.Screen
        name="sign-in"
        options={{
          presentation: "modal",
          header: () => null,
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          presentation: "modal",
          header: () => null,
        }}
      />
    </Stack>
  );
}
