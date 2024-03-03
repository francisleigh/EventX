import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import { Loading } from "~/components/app/Loading";
import { useSession } from "~/ctx/AuthContext";

export default function AuthLayout() {
  const session = useSession();

  if (session.initialisingAuth)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "tomato",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading />
      </View>
    );

  if (!session.authenticated) return <Redirect href={"/sign-in"} />;

  return (
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
        name="event-faq-form"
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
  );
}
