import { PageContainer } from "~/components/core/Layout";
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

  const [confirmation, setConfirmation] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const handleSignIn = async (formValues: SignInSchemaType) => {
    const confirmationResult = await session.signIn(formValues.phoneNumber);
    // console.log(
    //   "confirmationResult",
    //   JSON.stringify(confirmationResult, null, 2),
    // );
    if (confirmationResult) setConfirmation(confirmationResult);
  };
  const handleVerifyCode = async (formValues: PhoneVerificationSchemaType) => {
    if (!confirmation) throw new Error("No confirmation controller present.");

    console.log("confirm", formValues);
    const _conf = await confirmation?.confirm(formValues.verificationCode);
    console.log("conf", _conf);

    router.replace("/");
  };

  return (
    <PageContainer>
      <Text.H1>Sign In Page!</Text.H1>
      {confirmation ? (
        <PhoneVerificationForm onSubmit={handleVerifyCode} />
      ) : (
        <SignInForm onSubmit={handleSignIn} />
      )}
    </PageContainer>
  );
}
