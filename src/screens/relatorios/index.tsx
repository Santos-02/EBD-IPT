import { useState } from "react";
import Header from "../../components/header";
import RelatorioService from "../../services/RelatorioService";
import { tokens } from "../../theme";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { PictureAsPdf, Today, DateRange } from "@mui/icons-material";

const SOCIEDADES = ["UCP", "UPA", "UMP", "UPH", "SAF"];

const hoje = () => {
  const h = new Date();
  const m = String(h.getMonth() + 1).padStart(2, "0");
  const d = String(h.getDate()).padStart(2, "0");
  return `${h.getFullYear()}-${m}-${d}`;
};

const Relatorios = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tipo, setTipo] = useState<"dia" | "mes">("dia");
  const [sociedade, setSociedade] = useState<string>("UCP");
  const [data, setData] = useState<string>(hoje());
  const [mes, setMes] = useState<string>(String(new Date().getMonth() + 1).padStart(2, "0"));
  const [ano, setAno] = useState<string>(String(new Date().getFullYear()));
  const [gerando, setGerando] = useState(false);
  const [toast, setToast] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  const gerarRelatorio = async () => {
    setGerando(true);
    try {
      const pdfModule = await import("../../utils/pdfGenerator");

      if (tipo === "dia") {
        const resp = await RelatorioService.listarPresencasPorDia(sociedade, data);
        if (Array.isArray(resp)) {
          pdfModule.gerarPdfDia(sociedade, data, resp);
          setToast({ severity: "success", message: "Relatório gerado com sucesso!" });
        } else {
          setToast({ severity: "error", message: String(resp) });
        }
      } else {
        const resp = await RelatorioService.listarPresencasPorMes(
          sociedade,
          Number(mes),
          Number(ano)
        );
        if (resp && typeof resp === "object") {
          const dados = resp as { domingos: string[]; membros: { nome: string; datas: string[] }[] };
          pdfModule.gerarPdfMes(sociedade, Number(mes), Number(ano), dados.domingos, dados.membros);
          setToast({ severity: "success", message: "Relatório gerado com sucesso!" });
        } else {
          setToast({ severity: "error", message: String(resp) });
        }
      }
    } catch (e) {
      setToast({
        severity: "error",
        message: e instanceof Error ? e.message : "Erro ao gerar o relatório.",
      });
    } finally {
      setGerando(false);
    }
  };

  return (
    <Box sx={{ m: { xs: 1.5, sm: 2.5 } }}>
      <Header title="Relatórios" subtitle="Gere relatórios de presença em PDF" />

      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: "10px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
          p: "24px",
          maxWidth: "640px",
        }}
      >
        <Box sx={{ mb: "20px" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: "10px" }}>
            Tipo de relatório
          </Typography>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={tipo}
            onChange={(_, valor) => valor && setTipo(valor)}
            color="primary"
          >
            <ToggleButton value="dia" sx={{ py: "12px" }}>
              <Today sx={{ mr: 1 }} /> Por dia
            </ToggleButton>
            <ToggleButton value="mes" sx={{ py: "12px" }}>
              <DateRange sx={{ mr: 1 }} /> Por mês
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ mb: "20px" }}>
          <FormControl fullWidth size="small">
            <InputLabel id="select-sociedade-label">Sociedade</InputLabel>
            <Select
              labelId="select-sociedade-label"
              value={sociedade}
              label="Sociedade"
              onChange={(e) => setSociedade(e.target.value)}
            >
              {SOCIEDADES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {tipo === "dia" ? (
          <Box sx={{ mb: "20px" }}>
            <TextField
              fullWidth
              label="Data"
              type="date"
              size="small"
              value={data}
              onChange={(e) => setData(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        ) : (
          <Box sx={{ mb: "20px", display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Mês"
              type="number"
              size="small"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ maxWidth: 120 }}
            />
            <TextField
              fullWidth
              label="Ano"
              type="number"
              size="small"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ maxWidth: 140 }}
            />
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          startIcon={<PictureAsPdf />}
          disabled={gerando}
          onClick={gerarRelatorio}
          sx={{
            py: "12px",
            fontWeight: "bold",
            backgroundColor: colors.primary[500],
            "&:hover": {
              backgroundColor: colors.primary[600],
            },
          }}
        >
          {gerando ? "Gerando..." : "Gerar PDF"}
        </Button>
      </Box>

      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast?.severity}
          variant="filled"
          onClose={() => setToast(null)}
          sx={{ width: "100%" }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Relatorios;