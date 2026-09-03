import { useContext } from "react";
import Login from "../screens/login";
import Membros from "../screens/membro";
import Topbar from "../components/topBar";
import Usuarios from "../screens/usuario";
import AuthContext from "../context/auth";
import Cadastro from "../screens/cadastro";
import Sidebar from "../components/sidebar";
import Dashboard from "../screens/dashboard";
import Calendario from "../screens/calendario";
import { ColorModeContext, useMode } from "../theme";
import CadastrarMembro from "../screens/membro/cadastrar";
import RecuperarAcesso from "../screens/recuperarAcesso";
import { Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, Divider } from "@mui/material";
import EnviarEmailRecuperarAcesso from "../screens/enviarEmail";

const RoutesController: any = () => {
  const [theme, colorMode] = useMode();
  const { signed, user } = useContext(AuthContext) ?? { signed: false, user: undefined };
  // const { signed } = true;

  const Private = ({ item }: any) => {
    if (!signed || user?.tipoUsuario !== "master") {
      return <Navigate to="/" replace />;
    }

    return item;
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {signed ? <Sidebar /> : <></>}
          <main className="content">
            {signed ? <Topbar /> : <></>}
            <Divider />
            <Routes>
              {signed && <Route path="/dashboard" element={<Dashboard />} />}
              {signed && <Route path="/membros" element={<Membros />} />}
              {signed && <Route path="/calendario" element={<Calendario />} />}
              {signed && (
                <Route
                  path="/usuarios"
                  element={<Private item={<Usuarios />} />}
                />
              )}
              {signed && (
                <Route
                  path="/cadastrar-membro"
                  element={<Private item={<CadastrarMembro />} />}
                />
              )}
              <Route path="/" element={<Login />} />
              <Route path="/cadastrar" element={<Cadastro />} />
              <Route path="/recuperar-senha" element={<RecuperarAcesso />} />
              <Route
                path="/enviar-recuperar-acesso"
                element={<EnviarEmailRecuperarAcesso />}
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default RoutesController;