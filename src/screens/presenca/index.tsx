import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header";
import MembroService from "../../services/MembroService";
import PresencaService from "../../services/PresencaService";
import { localizedTextsMap } from "../../utils/localeTextTable";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { HowToReg, ClearAll, Save, History } from "@mui/icons-material";

const formatarData = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dia}`;
};

const proximoDomingo = () => {
  const agora = new Date();
  const diff = agora.getDay() === 0 ? 0 : 7 - agora.getDay();
  const domingo = new Date(agora);
  domingo.setDate(agora.getDate() + diff);
  return formatarData(domingo);
};

const ControlePresenca = () => {
  const theme = useTheme();
  const { sociedade } = useParams<{ sociedade: string }>();
  const sociedadeAtual = (sociedade || "").toUpperCase();

  const [membros, setMembros] = useState<any[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [data, setData] = useState(proximoDomingo());
  const [presenca, setPresenca] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    const membrosPromise = MembroService.listarMembros({
      sociedade: sociedadeAtual,
    });
    const presencaPromise = PresencaService.listarPresenca({
      sociedade: sociedadeAtual,
      date: data,
    });
    const historicoPromise = PresencaService.listarDatas({
      sociedade: sociedadeAtual,
    });

    Promise.all([membrosPromise, presencaPromise, historicoPromise])
      .then(([membrosResp, presencasResp, historicoResp]: any) => {
        if (!active) return;
        const lista = Array.isArray(membrosResp) ? membrosResp : [];
        setMembros(lista);

        const presentes = Array.isArray(presencasResp) ? presencasResp : [];
        setPresenca(
          Object.fromEntries(
            (presentes as any[]).map((id: any) => [id, true])
          )
        );

        setHistorico(Array.isArray(historicoResp) ? historicoResp : []);
      })
      .catch((e: any) => {
        console.error(e);
        if (active) {
          setMembros([]);
          setPresenca({});
          setHistorico([]);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [sociedadeAtual, data]);

  const presentes = useMemo(
    () => membros.filter((m: any) => presenca[m.id] === true).length,
    [membros, presenca]
  );

  const marcarTodos = () => {
    const todas = Object.fromEntries(membros.map((m: any) => [m.id, true]));
    setPresenca(todas);
  };

  const limpar = () => setPresenca({});

  const salvarPresenca = async () => {
    setSalvando(true);
    const presentesIds = membros
      .filter((m: any) => presenca[m.id] === true)
      .map((m: any) => m.id);

    const resp = await PresencaService.salvarPresenca({
      sociedade: sociedadeAtual,
      date: data,
      presentes: presentesIds,
    });
    setSalvando(false);

    if (resp?.success) {
      setToast({ severity: "success", message: resp.message });
    } else {
      setToast({
        severity: "error",
        message: resp?.message || "Erro ao salvar a presença.",
      });
    }
  };

  const columns: any = [
    {
      field: "name",
      headerName: "Nome",
      flex: 1,
      cellClassName: "nome-column--cell",
    },
    {
      field: "presente",
      headerName: "Presente",
      width: 120,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params: any) => (
        <Checkbox
          checked={presenca[params.row.id] === true}
          onChange={(e) =>
            setPresenca((prev) => ({ ...prev, [params.row.id]: e.target.checked }))
          }
        />
      ),
    },
  ];

  return (
    <Box sx={{ m: { xs: 1.5, sm: 2.5 } }}>
      <Header
        title={`${sociedadeAtual}`}
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          mb: "20px",
        }}
      >
        <TextField
          label="Data"
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: "10px",
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>Presentes:</Typography>
          <Typography sx={{ fontWeight: "bold" }}>{presentes}</Typography>
        </Box>
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: "10px",
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>Total:</Typography>
          <Typography sx={{ fontWeight: "bold" }}>{membros.length}</Typography>
        </Box>

        <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
          <Button variant="outlined" startIcon={<HowToReg />} onClick={marcarTodos}>
            Marcar todos
          </Button>
          <Button variant="outlined" startIcon={<ClearAll />} onClick={limpar}>
            Limpar
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            disabled={salvando}
            onClick={salvarPresenca}
            sx={{
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            {salvando ? "Salvando..." : "Salvar presença"}
          </Button>
        </Box>
      </Box>

      <Box sx={{ minHeight: "50vh" }}>
        <DataGrid
          rows={membros}
          columns={columns}
          rowCount={membros.length}
          loading={loading}
          disableColumnMenu
          rowSelection={false}
          autoHeight
          localeText={localizedTextsMap}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
          }}
        />
      </Box>

      <Box
        sx={{
          mt: "20px",
          backgroundColor: theme.palette.background.paper,
          borderRadius: "10px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
          p: "20px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: "10px" }}>
          <History />
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Histórico
          </Typography>
        </Box>

        {historico.length === 0 ? (
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Nenhum registro lançado ainda.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              maxHeight: "220px",
              overflowY: "auto",
            }}
          >
            {historico.map((item: any) => {
              const aberto = item.date === data;
              return (
                <Box
                  key={item.date}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    p: "10px 12px",
                    borderRadius: "8px",
                    backgroundColor: aberto
                      ? theme.palette.primary.main
                      : "transparent",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 600, color: aberto ? "#ffffff" : "inherit" }}
                  >
                    {item.date.split("-").reverse().join("/")}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ color: aberto ? "#ffffff" : "inherit" }}>
                      {item.total} presente(s)
                    </Typography>
                    <Button
                      size="small"
                      variant={aberto ? "contained" : "outlined"}
                      onClick={() => setData(item.date)}
                      sx={{
                        color: aberto ? "#00311D" : "inherit",
                        backgroundColor: aberto ? "#ffffff" : "transparent",
                        "&:hover": {
                          backgroundColor: aberto ? "#f0f0f0" : "transparent",
                        },
                      }}
                    >
                      Abrir
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
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

export default ControlePresenca;