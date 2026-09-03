import logo from "../../assets/logo.png";
import background from "../../assets/image.jpg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UsuarioService from "../../services/UsuarioService";
import React, { memo, useContext, useState } from "react";
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
import AuthContext from "../../context/auth";

const Cadastro: React.FC = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "error",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const resp: any = await UsuarioService.salvarUsuario2(data);
      if (resp?.id) {
        auth?.signIn(resp);
        navigate("/dashboard");
      } else {
        setSnackbar({
          open: true,
          message: resp || "Não foi possível realizar o cadastro!",
          severity: "error",
        });
      }
    } catch (e: any) {
      setSnackbar({
        open: true,
        message: e?.message || "Erro ao realizar o cadastro!",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

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
            Cadastro
          </Typography>

          <TextField
            id="Nome-basic"
            type="text"
            label="Nome"
            variant="standard"
            style={{ width: "100%" }}
            error={!!errors.nome}
            helperText={errors.nome ? "Nome é obrigatório" : ""}
            {...register("nome", { required: true })}
          />

          <TextField
            id="Telefone-basic"
            type="text"
            label="Telefone"
            variant="standard"
            style={{ width: "100%", marginTop: 20 }}
            {...register("telefone")}
          />

          <TextField
            id="Email-basic"
            type="email"
            label="E-mail"
            variant="standard"
            style={{ width: "100%", marginTop: 20 }}
            error={!!errors.email}
            helperText={errors.email ? "Email é obrigatório" : ""}
            {...register("email", { required: true })}
          />

          <TextField
            id="Senha-basic"
            type="password"
            label="Senha"
            variant="standard"
            style={{ width: "100%", marginTop: 20 }}
            error={!!errors.senha}
            helperText={errors.senha ? "Senha é obrigatória" : ""}
            {...register("senha", { required: true })}
          />

          <Button
            type="submit"
            disabled={submitting}
            style={{ marginTop: 50, marginBottom: 5, width: "100%" }}
            variant="contained"
          >
            {submitting ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Cadastrar"
            )}
          </Button>
          <a
            className="linkLogin"
            onClick={() => {
              navigate("/");
            }}
          >
            Retornar ao Login
          </a>
        </Card>
      </form>
      <Box
        component="footer"
        sx={{ py: 3, px: 2, mt: "auto", bottom: 0, position: "fixed" }}
      >
        <Container maxWidth="sm">
          <Typography
            sx={{ color: "white", textAlign: "center" }}
            variant="body1"
          >
            2024 - Desenvolvido por Santos-02©, todos os direitos reservados.
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
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const MemoizedCadastro = memo(Cadastro);
export default MemoizedCadastro;