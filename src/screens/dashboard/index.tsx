import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header";
import DashboardService from "../../services/DashboardService";
import { tokens } from "../../theme";
import {
  Box,
  Chip,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Cell,
  Bar,
  Pie,
  PieChart,
  BarChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
} from "recharts";
import { Group, Groups, Event, ArrowForward } from "@mui/icons-material";

const SOCIEDADE_CORES: Record<string, string> = {
  UCP: "#1F6FEB",
  UPA: "#2EBF82",
  UMP: "#6870FA",
  UPH: "#DB4F4A",
  SAF: "#E2A03F",
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [resumo, setResumo] = useState<any>({});
  const [porSociedade, setPorSociedade] = useState<any[]>([]);
  const [membrosRecentes, setMembrosRecentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DashboardService.listarResumo().then(setResumo);
    DashboardService.listarMembrosPorSociedade().then(setPorSociedade);
    DashboardService.listarMembrosRecentes()
      .then(setMembrosRecentes)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: "Total de Membros",
      value: resumo.totalMembros ?? 0,
      icon: <Group />,
      color: colors.primary[500],
    },
    {
      title: "Sociedades",
      value: porSociedade.filter((item) => item.total > 0).length,
      icon: <Groups />,
      color: colors.greenAccent[500],
    },
    {
      title: "Usuários Ativos",
      value: resumo.usuariosAtivos ?? 0,
      icon: <Event />,
      color: colors.blueAccent[400],
    },
  ];

  const columns: any = [
    {
      field: "name",
      headerName: "Nome",
      flex: 1,
      cellClassName: "nome-column--cell",
    },
    {
      field: "society",
      headerName: "Sociedade",
      flex: 1,
      renderCell: (params: any) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            color: "white",
            fontWeight: "bold",
            backgroundColor: SOCIEDADE_CORES[params.value] || colors.grey[500],
          }}
        />
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Dashboard" subtitle="Visão geral da Escola Bíblica Dominical" />

      {/* Cards de resumo */}
      <Box
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(12, 1fr)"
        sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 12" } }}
      >
        {cards.map((card) => (
          <Box
            key={card.title}
            gridColumn="span 4"
            minHeight="120px"
            backgroundColor={theme.palette.background.paper}
            borderRadius="10px"
            boxShadow="0px 2px 10px rgba(0,0,0,0.15)"
            p="20px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h3" color={colors.grey[100]} fontWeight="bold">
                {card.value}
              </Typography>
              <Typography variant="h5" color={colors.grey[100]}>
                {card.title}
              </Typography>
            </Box>
            <Box
              bgcolor={card.color}
              width="50px"
              height="50px"
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              {card.icon}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Gráficos */}
      <Box
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(12, 1fr)"
        mt="30px"
        sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 12" } }}
      >
        <Box
          gridColumn="span 8"
          backgroundColor={theme.palette.background.paper}
          borderRadius="10px"
          boxShadow="0px 2px 10px rgba(0,0,0,0.15)"
          p="20px"
          height="380px"
        >
          <Typography variant="h4" fontWeight="bold" mb="20px">
            Membros por Sociedade
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={porSociedade}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[800]} />
              <XAxis dataKey="society" stroke={colors.grey[100]} />
              <YAxis stroke={colors.grey[100]} allowDecimals={false} />
              <ChartTooltip />
              <Legend />
              <Bar dataKey="total" name="Membros" fill="#1F6FEB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box
          gridColumn="span 4"
          backgroundColor={theme.palette.background.paper}
          borderRadius="10px"
          boxShadow="0px 2px 10px rgba(0,0,0,0.15)"
          p="20px"
          height="380px"
        >
          <Typography variant="h4" fontWeight="bold" mb="20px">
            Distribuição
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={porSociedade}
                dataKey="total"
                nameKey="society"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry: any) => entry.society}
              >
                {porSociedade.map((item) => (
                  <Cell
                    key={item.society}
                    fill={SOCIEDADE_CORES[item.society] || colors.grey[500]}
                  />
                ))}
              </Pie>
              <ChartTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Lista de membros recentes */}
      <Box
        backgroundColor={theme.palette.background.paper}
        borderRadius="10px"
        boxShadow="0px 2px 10px rgba(0,0,0,0.15)"
        p="20px"
        mt="30px"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight="bold">
            Membros Recentes
          </Typography>
          <Link to="/membros" style={{ textDecoration: "none" }}>
            <Button
              sx={{ fontSize: "13px", fontWeight: "bold", padding: "8px 16px" }}
            >
              Ver Todos
              <ArrowForward sx={{ ml: "6px" }} />
            </Button>
          </Link>
        </Box>

        <Box mt="10px" minHeight="30vh">
          <DataGrid
            rows={membrosRecentes}
            columns={columns}
            rowCount={membrosRecentes.length}
            loading={loading}
            disableColumnMenu
            autoHeight
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;