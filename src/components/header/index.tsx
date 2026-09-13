import { useContext } from "react";
import { tokens, ColorModeContext } from "../../theme";
import MenuContext from "../../context/menu";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
} from "@mui/icons-material";

const Header = ({ title, subtitle }: any) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { openMenu } = useContext(MenuContext);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isMobile = !isNonMobile;

  return (
    <Box sx={{ mb: "30px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          variant="h2"
          color={theme.palette.mode === "dark" ? colors.grey[200] : "#00311D"}
          sx={{ fontWeight: "bold", lineHeight: 1.2, fontSize: isNonMobile ? undefined : 30 }}
        >
          {title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isMobile && openMenu && (
            <IconButton onClick={openMenu} aria-label="Abrir menu">
              <MenuOutlined />
            </IconButton>
          )}
          <IconButton
            onClick={colorMode.toggleColorMode}
            aria-label="Alternar tema"
          >
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined />
            ) : (
              <LightModeOutlined />
            )}
          </IconButton>
        </Box>
      </Box>

      {subtitle && (
        <Typography
          variant="h5"
          color={
            theme.palette.mode === "dark" ? colors.grey[400] : colors.greenAccent[400]
          }
        >
          {subtitle}
        </Typography>
      )}

      <Box sx={{ mt: "20px", borderBottom: `1px solid ${theme.palette.divider}` }} />
    </Box>
  );
};

export default Header;