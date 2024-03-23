import React, { useEffect, useState } from "react";
import firebaseAuth, {
  firebase,
  FirebaseAuthTypes,
} from "@react-native-firebase/auth";
import { reload, User } from "@firebase/auth";
import backend, { auth } from "~/backend";

import * as RNAuth from "@react-native-firebase/auth";

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
  updateUser: (data: User) => Promise<void>;
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
  updateUser: async () => {},
});

// This hook can be used to access the user info.
export function useSession() {
  return React.useContext(AuthContext);
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [initialisingAuth, setInitialisingAuth] = useState<boolean>(true);
  const [authBusy, setAuthBusy] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const [confirmHandler, setConfirmHandler] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  useEffect(() => {
    return firebaseAuth().onAuthStateChanged((user) => {
      console.log("onAuthStateChanged", user);
      setInitialisingAuth(false);
      setUser(user as User | null);
    });
  }, []);

  const signIn: AuthState["signIn"] = async (phoneNumber) => {
    setAuthBusy(true);
    try {
      const confirm = await firebaseAuth().signInWithPhoneNumber(phoneNumber);
      if (confirm) setConfirmHandler(confirm);
    } catch (e: any) {
      setUser(null);
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
      await confirmHandler.confirm(verificationCode);
    } catch (e: any) {
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
    await firebaseAuth().signOut();
    return new Promise((res) => {
      setUser(null);
      setAuthBusy(false);
      res();
    });
  };

  const reloadUser: AuthState["reloadUser"] = async () => {
    if (!firebase.auth().currentUser) return;

    setUser(firebase.auth().currentUser as unknown as User);
  };

  const updateUser: AuthState["updateUser"] = async (data) => {
    await firebase.auth().currentUser?.updateProfile(data);

    await reloadUser();
  };

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
        authenticated: !!user?.uid,
        reloadUser,
        updateUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
