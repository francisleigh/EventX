import { Card, PageContainer } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { useSession } from "~/ctx/AuthContext";
import { useRouter } from "expo-router";
import { SignInForm } from "~/components/forms/SignIn";
import { PhoneVerificationSchemaType, SignInSchemaType } from "~/types.schema";
import { useState } from "react";
import { PhoneVerificationForm } from "~/components/forms/PhoneVerification";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export default function SignInPage() {
  const session = useSession();
  const router = useRouter();

  const [confirmHandler, setConfirmHandler] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const handleSignIn = async (formValues: SignInSchemaType) => {
    await session.signIn(formValues.phoneNumber);
  };

  const handleVerifyCode = async (formValues: PhoneVerificationSchemaType) => {
    await session.verifyNumber(formValues.verificationCode);

    router.replace("/");
  };

  return (
    <PageContainer>
      <Text.H1>Sign in</Text.H1>
      <Card>
        <Text.Span>
          Access your account via the inputs below. If you don't have an
          account, we will create one for you. Simple!
        </Text.Span>
      </Card>
      {session.canVerifyNumber ? (
        <PhoneVerificationForm onSubmit={handleVerifyCode} />
      ) : (
        <SignInForm onSubmit={handleSignIn} />
      )}
    </PageContainer>
  );
}
