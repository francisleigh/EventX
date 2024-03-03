import { Redirect } from "expo-router";

export default function FirebaseAuthResponsePage(props: unknown) {
  return <Redirect href={"/sign-in"} />;
}
