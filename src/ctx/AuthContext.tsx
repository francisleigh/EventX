import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { reload, User } from "@firebase/auth";

type AuthState = {
  userId: string | undefined;
  user: User | null;
  initialisingAuth: boolean;
  authenticated: boolean;
  authBusy: boolean;
  signIn: (phoneNumber: string) => Promise<void>;
  canVerifyNumber: boolean;
  verifyNumber: (verificationCode: string) => Promise<void>;
  signOut: () => Promise<void>;
  reloadUser: () => Promise<void>;
};

const AuthContext = React.createContext<AuthState>({
  userId: undefined,
  user: null,
  authenticated: false,
  initialisingAuth: true,
  authBusy: false,
  signIn: async () => undefined,
  canVerifyNumber: false,
  verifyNumber: async () => {},
  signOut: async () => {},
  reloadUser: async () => {},
});

// This hook can be used to access the user info.
export function useSession() {
  return React.useContext(AuthContext);
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [initialisingAuth, setInitialisingAuth] = useState<boolean>(true);
  const [authBusy, setAuthBusy] = useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const [confirmHandler, setConfirmHandler] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  useEffect(() => {
    async function init() {
      return new Promise((res) => {
        setInitialisingAuth(false);
        setAuthenticated(!!auth().currentUser);
        setUser(auth().currentUser);
        res(true);
      });
    }

    void init();
  }, []);

  const signIn: AuthState["signIn"] = async (phoneNumber) => {
    setAuthBusy(true);
    try {
      console.log("sign in", phoneNumber);
      const confirm = await auth().signInWithPhoneNumber(phoneNumber);
      console.log("confirm", JSON.stringify(confirm, null, 2));
      if (confirm) setConfirmHandler(confirm);
    } catch (e) {
      setAuthenticated(false);
      setUser(null);
      console.log("signIn error", e);
      throw new Error(e?.message ?? "Sign in error");
    } finally {
      setAuthBusy(false);
    }
  };

  const confirmSignIn: AuthState["verifyNumber"] = async (
    verificationCode: string,
  ) => {
    if (!confirmHandler) throw new Error("No confirmation controller present.");

    try {
      const confirmation = await confirmHandler.confirm(verificationCode);
      if (confirmation?.user) {
        setAuthenticated(true);
        setUser(confirmation.user);
      }
    } catch (e) {
      setAuthenticated(false);
      setUser(null);
      console.log("confirmSignIn error", e);
      throw new Error(e?.message ?? "Confirmation error");
    } finally {
      setAuthBusy(false);
      setConfirmHandler(null);
    }
  };

  const signOut: AuthState["signOut"] = async () => {
    setAuthBusy(true);
    await auth().signOut();
    return new Promise((res) => {
      setAuthenticated(false);
      setUser(null);
      setAuthBusy(false);
      res();
    });
  };

  const reloadUser: AuthState["reloadUser"] = async () => {
    if (!!user) {
      await reload(user);
    }
    setUser(auth().currentUser);
  };

  console.log("USER", user);

  return (
    <AuthContext.Provider
      value={{
        userId: user?.uid,
        user,
        initialisingAuth,
        authBusy,
        signIn,
        canVerifyNumber: !!confirmHandler,
        verifyNumber: confirmSignIn,
        signOut,
        authenticated,
        reloadUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
