import { useContext } from "react";
import { useTheme, Box, IconButton, Typography } from "@mui/material";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { ColorModeContext, tokens } from "../../theme";
import AuthContext from "../../context/auth";

const TopBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { user } = useContext(AuthContext);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
      <Box sx={{ flex: 1 }}>
        {user?.nome && (
          <Typography variant="h5" color={colors.grey[100]}>
            Olá, <strong>{user.nome}</strong>
          </Typography>
        )}
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlined />
          ) : (
            <LightModeOutlined />
          )}
        </IconButton>

        <Box
          width="38px"
          height="38px"
          borderRadius="50%"
          bgcolor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          fontWeight="bold"
        >
          {(user?.nome || "?").substring(0, 1).toUpperCase()}
        </Box>
      </Box>
    </Box>
  );
};

export default TopBar;