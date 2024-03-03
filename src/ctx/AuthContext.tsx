import React, { useEffect, useState } from "react";
import { auth } from "~/backend";

type AuthState = {
  initialisingAuth: boolean;
  authenticated: boolean;
  authBusy: boolean;
  signIn: (phoneNumber: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthState>({
  authenticated: false,
  initialisingAuth: true,
  authBusy: false,
  signIn: async () => {},
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

  useEffect(() => {
    async function init() {
      return new Promise((res) => {
        setInitialisingAuth(false);
        setAuthenticated(!!auth.currentUser);
        res(true);
      });
    }

    void init();
  }, []);

  const signIn: AuthState["signIn"] = async (phoneNumber) => {
    setAuthBusy(true);
    return new Promise((res) => {
      setAuthenticated(true);
      setAuthBusy(false);
      res();
    });
  };

  const signOut: AuthState["signOut"] = async () => {
    setAuthBusy(true);
    return new Promise((res) => {
      setAuthenticated(false);
      setAuthBusy(false);
      res();
    });
  };

  return (
    <AuthContext.Provider
      value={{
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
