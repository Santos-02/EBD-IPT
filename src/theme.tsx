import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import * as locales from "@mui/material/locale";

type SupportedLocales = keyof typeof locales;
const locale: SupportedLocales = "ptBR";

// color design tokens export
export const tokens = (mode: any) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#ededed",
          200: "#d4d4d4",
          300: "#b8b8b8",
          400: "#9e9e9e",
          500: "#808080",
          600: "#666666",
          700: "#4d4d4d",
          800: "#363636",
          900: "#1f1f1f",
        },
        primary: {
          100: "#ffffff",
          200: "#e0e0e0",
          300: "#c2c2c2",
          400: "#a3a3a3",
          500: "#7a7a7a",
          600: "#5c5c5c",
          700: "#424242",
          800: "#2b2b2b",
          900: "#1b1b1b",
        },
        greenAccent: {
          100: "#f1f1f1",
          200: "#d9d9d9",
          300: "#bdbdbd",
          400: "#a1a1a1",
          500: "#858585",
          600: "#6b6b6b",
          700: "#525252",
          800: "#3a3a3a",
          900: "#242424",
        },
        redAccent: {
          100: "#f1f1f1",
          200: "#d9d9d9",
          300: "#bdbdbd",
          400: "#a1a1a1",
          500: "#858585",
          600: "#6b6b6b",
          700: "#525252",
          800: "#3a3a3a",
          900: "#242424",
        },
        blueAccent: {
          100: "#f1f1f1",
          200: "#d9d9d9",
          300: "#bdbdbd",
          400: "#a1a1a1",
          500: "#858585",
          600: "#6b6b6b",
          700: "#525252",
          800: "#3a3a3a",
          900: "#242424",
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#e7f1ec",
          200: "#b6d2c3",
          300: "#7da791",
          400: "#4b7f64",
          500: "#00311D", // Identidade visual no modo claro
          600: "#002b19",
          700: "#002416",
          800: "#001d11",
          900: "#00160c",
        },
        greenAccent: {
          100: "#e6faf2",
          200: "#bcead7",
          300: "#8fd6b8",
          400: "#5cbf96",
          500: "#2f9d6e",
          600: "#1f7f57",
          700: "#136245",
          800: "#094830",
          900: "#043018",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          100: "#151632",
          200: "#2a2d64",
          300: "#3e4396",
          400: "#535ac8",
          500: "#6870fa",
          600: "#868dfb",
          700: "#a4a9fc",
          800: "#c3c6fd",
          900: "#e1e2fe",
        },
      }),
});

// mui theme settings
export const themeSettings = (mode: any) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary[200],
            },
            label: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[400],
            },
            neutral: {
              dark: colors.grey[800],
              main: colors.grey[500],
              light: colors.grey[300],
            },
            background: {
              default: "#151515",
              paper: "#1e1e1e",
            },
          }
        : {
            primary: {
              main: colors.primary[500],
            },
            label: {
              main: colors.primary[700],
            },
            secondary: {
              main: colors.greenAccent[600],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#f6f7f6",
              paper: "#ffffff",
            },
          }),
    },
    typography: {
      fontFamily: ["Poppins", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 40,
        fontWeight: 700,
        color: mode === "dark" ? colors.grey[100] : colors.grey[900],
      },
      h2: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 32,
        fontWeight: 600,
        color: mode === "dark" ? colors.grey[200] : colors.primary[500],
      },
      h3: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 500,
        color: mode === "dark" ? colors.grey[300] : colors.grey[700],
      },
      h4: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 500,
        color: mode === "dark" ? colors.grey[400] : colors.grey[600],
      },
      h5: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 400,
        color: mode === "dark" ? colors.grey[500] : colors.grey[500],
      },
      h6: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 14,
        fontWeight: 400,
        color: mode === "dark" ? colors.grey[600] : colors.grey[400],
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme: any = useMemo(
    () => createTheme(themeSettings(mode), locales[locale]),
    [mode]
  );
  return [theme, colorMode];
};