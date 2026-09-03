import { useForm } from "react-hook-form";
import logo from "../../assets/logo.png";
import AuthContext from "../../context/auth";
import { useNavigate } from "react-router-dom";
import background from "../../assets/image.jpg";
import React, { memo, useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  Button,
  TextField,
  Container,
  Typography,
  Alert,
  Snackbar,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import UsuarioService from "../../services/UsuarioService";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const resp: any = await UsuarioService.login(data);
      if (resp?.id) {
        auth?.signIn(resp);
        navigate("/dashboard");
      } else {
        setSnackbar({
          open: true,
          message: resp || "Não foi possível realizar o login!",
        });
      }
    } catch (e: any) {
      setSnackbar({ open: true, message: e?.message || "Erro ao realizar o login!" });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get("access_token") || "";
    const refresh_token = params.get("refresh_token") || "";

    if (access_token && refresh_token) {
      navigate("/recuperar-senha", { state: { access_token, refresh_token } });
    }
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundSize: "cover",
        justifyContent: "center",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(${background})`,
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card
          sx={{
            maxWidth: isNonMobile ? 390 : 350,
            backgroundColor: "#FBF7F4",
            borderRadius: 10,
            padding: 5,
            textAlign: "center",
          }}
        >
          <div style={{ alignItems: "center", textAlign: "center" }}>
            <img style={{ width: 100 }} src={logo} alt="logo" />
          </div>

          <Typography color="#ADADAD" fontSize={30}>
            Bem-vindo!
          </Typography>

          <TextField
            id="Email-basic"
            type="email"
            label="E-mail"
            variant="standard"
            style={{ width: "100%" }}
            error={!!errors.email}
            helperText={errors.email ? "Email é obrigatório" : ""}
            {...register("email", {
              required: true,
            })}
          />

          <TextField
            id="Senha-basic"
            type="password"
            label="Senha"
            variant="standard"
            style={{ width: "100%", marginTop: 20 }}
            error={!!errors.senha}
            helperText={errors.senha ? "Senha é obrigatória" : ""}
            {...register("senha", {
              required: true,
            })}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <a
              className="linkLogin"
              onClick={() => {
                navigate("/enviar-recuperar-acesso");
              }}
            >
              Esqueci a senha
            </a>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            style={{ marginTop: 50, marginBottom: 5, width: "100%" }}
            variant="contained"
          >
            {submitting ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Login"
            )}
          </Button>
          <a
            className="linkLogin"
            onClick={() => {
              navigate("/cadastrar");
            }}
          >
            Cadastrar-se
          </a>
        </Card>
      </form>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          bottom: 0,
          position: "fixed",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            sx={{ color: "white", textAlign: "center" }}
            variant="body1"
          >
            2024 - Desenvolvido por Neves369©, todos os direitos reservados.
          </Typography>
        </Container>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const MemoizedLogin = memo(Login);
export default MemoizedLogin;