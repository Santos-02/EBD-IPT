import { useContext, useState, useEffect } from "react";
import Login from "../screens/login";
import Membros from "../screens/membro";
import Usuarios from "../screens/usuario";
import AuthContext from "../context/auth";
import Sidebar from "../components/sidebar";
import Dashboard from "../screens/dashboard";
import { MenuProvider } from "../context/menu";
import { ColorModeContext, useMode } from "../theme";
import CadastrarMembro from "../screens/membro/cadastrar";
import ControlePresenca from "../screens/presenca";
import RecuperarAcesso from "../screens/recuperarAcesso";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box, Drawer, CssBaseline, ThemeProvider } from "@mui/material";
import EnviarEmailRecuperarAcesso from "../screens/enviarEmail";

const RoutesController: any = () => {
  const [theme, colorMode] = useMode();
  const { signed, hydrated } = useContext(AuthContext) ?? {
    signed: false,
    hydrated: false,
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (!hydrated) {
    return null;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app" data-mode={theme.palette.mode}>
          {signed ? (
            <Box
              sx={{
                display: { xs: "none", sm: "block" },
                flexShrink: 0,
              }}
            >
              <Sidebar />
            </Box>
          ) : (
            <></>
          )}

          {signed ? (
            <Drawer
              anchor="left"
              open={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
              sx={{
                height: "100%",
                "& .MuiDrawer-paper": { width: 250, height: "100%" },
              }}
            >
              <Sidebar onMobileClose={() => setMobileMenuOpen(false)} />
            </Drawer>
          ) : (
            <></>
          )}

          <main className="content">
            <MenuProvider value={{ openMenu: () => setMobileMenuOpen(true) }}>
              {signed ? (
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/membros" element={<Membros />} />
                  <Route
                    path="/controle-presenca/:sociedade"
                    element={<ControlePresenca />}
                  />
                  <Route path="/usuarios" element={<Usuarios />} />
                  <Route path="/cadastrar-membro" element={<CadastrarMembro />} />
                  <Route
                    path="/login"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route
                    path="/recuperar-senha"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route
                    path="/enviar-recuperar-acesso"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              ) : (
                <Routes>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/recuperar-senha" element={<RecuperarAcesso />} />
                  <Route
                    path="/enviar-recuperar-acesso"
                    element={<EnviarEmailRecuperarAcesso />}
                  />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              )}
            </MenuProvider>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default RoutesController;