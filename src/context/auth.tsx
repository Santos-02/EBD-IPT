import { createContext, useState, useEffect } from "react";
import IUsuario from "../models/IUsuario";

interface AuthContextData {
  signed: boolean;
  user: IUsuario | undefined;
  signIn(usuario: IUsuario): Promise<void>;
  signOut(): void;
  signOutClearUser(): void;
  signOutClearAll(): void;
}

const AuthContext = createContext<AuthContextData | any>({});

export const AuthProvider: any = ({ children }: any) => {
  const [signedUser, setSignedUser] = useState(false);
  const [user, setUser] = useState<IUsuario | undefined>(undefined);

  useEffect(() => {
    function loadStorageData() {
      const storageUser = sessionStorage.getItem("user");
      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setSignedUser(true);
      }
    }
    loadStorageData();
  }, []);

  function signIn(usuario: IUsuario) {
    setUser(usuario);
    setSignedUser(true);
    sessionStorage.setItem("user", JSON.stringify(usuario));
  }

  function signOut() {
    setSignedUser(false);
  }

  async function signOutClearAll() {
    sessionStorage.clear();
    setSignedUser(false);
    setUser(undefined);
  }

  async function signOutClearUser() {

  }

  return (
    <AuthContext.Provider
      value={{
        signed: signedUser,
        user,
        signIn,
        signOut,
        signOutClearAll,
        signOutClearUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;