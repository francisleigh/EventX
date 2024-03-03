import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { User } from "@firebase/auth";

type AuthState = {
  user: User | null;
  initialisingAuth: boolean;
  authenticated: boolean;
  authBusy: boolean;
  signIn: (
    phoneNumber: string,
  ) => Promise<FirebaseAuthTypes.ConfirmationResult | undefined>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthState>({
  user: null,
  authenticated: false,
  initialisingAuth: true,
  authBusy: false,
  signIn: async () => undefined,
  signOut: async () => {},
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
      return await auth().signInWithPhoneNumber(phoneNumber);
    } catch (e) {
      console.log("signIn error", e);
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

  console.log("USER", user);

  return (
    <AuthContext.Provider
      value={{
        user,
        initialisingAuth,
        authBusy,
        signIn,
        signOut,
        authenticated,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
