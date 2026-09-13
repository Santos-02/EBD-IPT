import { createContext, useState, useEffect, type ReactNode } from "react";
import supabase from "../api/supabaseClient";
import type IUsuario from "../models/IUsuario";

export interface AuthContextData {
  signed: boolean;
  hydrated: boolean;
  user: IUsuario | undefined;
  signIn(usuario: IUsuario): void;
  signOutClearAll(): void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface UsuarioRow {
  id: number;
  name: string;
  phone: string;
  created_at: string;
  email: string;
}

const mapRowToUsuario = (row: UsuarioRow): IUsuario => ({
  id: row.id,
  token: "",
  nome: row.name,
  telefone: row.phone,
  dataCadastro: row.created_at,
  dataUltimaAlteracao: "",
  email: row.email,
  senha: "",
  avatar: "",
});

const fetchUsuarioBySession = async (userId: string): Promise<IUsuario | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapRowToUsuario(data);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [signed, setSigned] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<IUsuario | undefined>(undefined);

  useEffect(() => {
    let active = true;

    const hydrateFromSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        if (active) {
          setSigned(false);
          setUser(undefined);
        }
        if (active) {
          setHydrated(true);
        }
        return;
      }

      const usuario = await fetchUsuarioBySession(session.user.id);
      if (active && usuario) {
        setUser(usuario);
        setSigned(true);
      }
      if (active) {
        setHydrated(true);
      }
    };

    hydrateFromSession();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const usuario = await fetchUsuarioBySession(session.user.id);
        if (active && usuario) {
          setUser(usuario);
          setSigned(true);
        }
      } else if (active) {
        setSigned(false);
        setUser(undefined);
      }
      if (active) {
        setHydrated(true);
      }
    });

    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  function signIn(usuario: IUsuario) {
    setUser(usuario);
    setSigned(true);
  }

  async function signOutClearAll() {
    await supabase.auth.signOut();
    setSigned(false);
    setUser(undefined);
  }

  return (
    <AuthContext.Provider
      value={{
        signed,
        hydrated,
        user,
        signIn,
        signOutClearAll,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
