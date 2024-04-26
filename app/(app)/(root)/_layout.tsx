import { Redirect, Stack } from "expo-router";
import { Image } from "react-native";
import { useSession } from "~/ctx/AuthContext";
import { sHeight, sWidth } from "~/constants/layout";

export default function AuthLayout() {
  const session = useSession();

  // useEffect(() => {
  //   let unsubscribeNetInfo: NetInfoSubscription | undefined;
  //   console.log("NET INFO", NetInfo);
  //   if (NetInfo) {
  //     unsubscribeNetInfo = NetInfo?.addEventListener((state) => {
  //       console.log("netinfo state", state);
  //     });
  //   }
  //
  //   return () => {
  //     if (unsubscribeNetInfo) unsubscribeNetInfo();
  //   };
  // }, []);

  if (session.initialisingAuth)
    return (
      <Image
        source={require("../../../assets/splash.png")}
        style={{
          height: sHeight,
          width: sWidth,
        }}
      />
    );

  if (!session.authenticated) return <Redirect href={"/sign-in"} />;

  // if (!netInfo.isConnected) return <Redirect href={"/no-internet"} />;

  if (!session.user?.displayName) return <Redirect href={"/edit-profile"} />;

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
