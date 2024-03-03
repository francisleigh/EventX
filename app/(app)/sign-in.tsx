import { PageContainer } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { Button } from "~/components/core/Button";
import { ButtonProps } from "react-native";
import { useSession } from "~/ctx/AuthContext";
import { useRouter } from "expo-router";

export default function SignInPage() {
  const session = useSession();
  const router = useRouter();

  const handleSignIn: ButtonProps["onPress"] = () => {
    void session.signIn("+441234567890");
    setTimeout(() => {
      router.replace("/");
    }, 1000);
  };

  return (
    <PageContainer>
      <Text.H1>Sign In Page!</Text.H1>
      <Button busy={session.authBusy} onPress={handleSignIn}>
        Sign in
      </Button>
    </PageContainer>
  );
}
