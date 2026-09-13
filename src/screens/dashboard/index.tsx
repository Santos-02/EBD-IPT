import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import DashboardService from "../../services/DashboardService";
import { tokens } from "../../theme";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Cell,
  Bar,
  Pie,
  PieChart,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
} from "recharts";
import UCP_logo from "../../assets/UCP.png";
import UPA_logo from "../../assets/UPA.png";
import UMP_logo from "../../assets/UMP.png";
import UPH_logo from "../../assets/UPH.png";
import SAF_logo from "../../assets/SAF.png";

const SOCIEDADES = ["UCP", "UPA", "UMP", "UPH", "SAF"];

const SOCIEDADE_IMAGENS: Record<string, string> = {
  UCP: UCP_logo,
  UPA: UPA_logo,
  UMP: UMP_logo,
  UPH: UPH_logo,
  SAF: SAF_logo,
};

const formatarDataCurta = (data: string) => {
  const partes = data.split("-");
  return `${partes[2]}/${partes[1]}`;
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isDark = theme.palette.mode === "dark";

  const [porSociedade, setPorSociedade] = useState<any[]>([]);
  const [presencasPorData, setPresencasPorData] = useState<any[]>([]);

  useEffect(() => {
    DashboardService.listarMembrosPorSociedade().then((data: any) =>
      setPorSociedade(Array.isArray(data) ? data : [])
    );
    DashboardService.listarPresencasPorData().then((data: any) =>
      setPresencasPorData(Array.isArray(data) ? data : [])
    );
  }, []);

  const sociedades = Array.isArray(porSociedade) ? porSociedade : [];
  const presencas = Array.isArray(presencasPorData) ? presencasPorData : [];

  const totalPorSociedade = (sociedade: string) =>
    sociedades.find((item) => item.society === sociedade)?.total ?? 0;

  return (
    <Box sx={{ m: { xs: 1.5, sm: 2.5 } }}>
      <Header title="Dashboard" />

      <Box
        sx={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(5, 1fr)",
          },
        }}
      >
        {SOCIEDADES.map((sociedade) => (
          <Button
            key={sociedade}
            fullWidth
            variant="contained"
            onClick={() => navigate(`/controle-presenca/${sociedade}`)}
            sx={{
              backgroundColor: isDark ? colors.grey[700] : "#555555",
              color: "#ffffff",
              borderRadius: "10px",
              py: "24px",
              px: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: isDark ? colors.grey[600] : "#002b19",
              },
            }}
          >
            <Box
              component="img"
              src={SOCIEDADE_IMAGENS[sociedade]}
              alt={`Sociedade ${sociedade}`}
              sx={{
                width: 56,
                height: 56,
                // borderRadius: "10%",
                objectFit: "cover",
              }}
            />
            <Typography sx={{ fontSize: 20, fontWeight: "bold", lineHeight: 1 }}>
              {sociedade}
            </Typography>
            <Typography sx={{ fontSize: 13, lineHeight: 1, opacity: 0.9 }}>
              {totalPorSociedade(sociedade)} membro(s)
            </Typography>
          </Button>
        ))}
      </Box>

      {/* Gráficos */}
      <Box
        sx={{
          display: "grid",
          gap: "30px",
          gridTemplateColumns: "repeat(12, 1fr)",
          mt: "30px",
        }}
      >
        <Box
          sx={{
            gridColumn: { xs: "span 12", md: "span 8" },
            backgroundColor: theme.palette.background.paper,
            borderRadius: "10px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
            p: "20px",
            height: { xs: "260px", sm: "380px" },
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: "20px" }}>
            Presenças por Data
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={presencas}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[800]} />
              <XAxis
                dataKey="date"
                stroke={colors.grey[100]}
                tickFormatter={formatarDataCurta}
              />
              <YAxis stroke={colors.grey[100]} allowDecimals={false} />
              <ChartTooltip
                formatter={(value: any) => [value, "Presentes"]}
                labelFormatter={(label: any) => label.split("-").reverse().join("/")}
              />
              <Bar
                dataKey="total"
                name="Presentes"
                fill={isDark ? colors.grey[400] : "#00311D"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box
          sx={{
            gridColumn: { xs: "span 12", md: "span 4" },
            backgroundColor: theme.palette.background.paper,
            borderRadius: "10px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
            p: "20px",
            height: { xs: "260px", sm: "380px" },
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: "20px" }}>
            Membros por Sociedade
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={sociedades}
                dataKey="total"
                nameKey="society"
                cx="50%"
                cy="50%"
                outerRadius={isNonMobile ? 100 : 70}
                label={(entry: any) => entry.society}
              >
                {sociedades.map((item) => (
                  <Cell
                    key={item.society}
                    fill={isDark ? colors.grey[500] : "#00311D"}
                  />
                ))}
              </Pie>
              <ChartTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;