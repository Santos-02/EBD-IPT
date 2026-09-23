import logo from "../../assets/image.jpg";
import { useState, useContext } from "react";
import AuthContext from "../../context/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme, Box, useMediaQuery } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const SidebarCustom = ({ onMobileClose }: any) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const location = useLocation();
    const isMobile = useMediaQuery("(max-width:599px)");

    const [isCollapsed, setIsCollapsed] = useState(false);
    const signOutClearAll = useContext(AuthContext)?.signOutClearAll;

    const isDark = theme.palette.mode === "dark";

    const { pathname } = location;

    function getSelectedKey(path: string): string {
        switch (true) {
            case path === "/dashboard":
            case path.startsWith("/controle-presenca"):
                return "Dashboard";

            case path.startsWith("/membros"):
            case path.startsWith("/cadastrar-membro"):
                return "Membros";

            case path.startsWith("/relatorios"):
                return "Relatórios";

            default:
                return "";
        }
    }

    const selected = getSelectedKey(pathname);

    const Item = ({ title, to, icon }: any) => {
        return (
            <MenuItem
                active={selected === title}
                onClick={() => navigate(to)}
                style={{
                    position: "relative",
                    color: selected === title ? "#ffffff" : "inherit",
                    backgroundColor:
                        selected === title
                            ? isDark
                                ? "rgba(255,255,255,0.18)"
                                : "#00311D"
                            : "",
                }}
                icon={isCollapsed && selected === title ? "" : icon}
            >
                {!isCollapsed && (
                    <Box sx={{ fontSize: 16, fontWeight: 600 }}>
                        {title}
                    </Box>
                )}
            </MenuItem>
        );
    };

    return (
        <Sidebar
            collapsed={isCollapsed}
            backgroundColor={theme.palette.background.paper}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    minHeight: "100vh",
                }}
            >
                <Menu>
                    <MenuItem
                        onClick={() =>
                            isMobile
                                ? onMobileClose?.()
                                : setIsCollapsed(!isCollapsed)
                        }
                        style={{
                            margin: "10px 0 0 0",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            style={{
                                width: isCollapsed ? 50 : 45,
                                height: isCollapsed ? 50 : 45,
                                borderRadius: 8,
                                objectFit: "cover",
                            }}
                            src={logo}
                            alt="logo"
                        />
                    </MenuItem>

                    <Box className="sidebar-divider">
                        <Item
                            title="Dashboard"
                            to="/dashboard"
                            icon={<DashboardIcon fontSize="medium" />}
                        />

                        <Item
                            title="Membros"
                            to="/membros"
                            icon={<MenuBookIcon fontSize="medium" />}
                        />

                        <Item
                            title="Relatórios"
                            to="/relatorios"
                            icon={<PictureAsPdfIcon fontSize="medium" />}
                        />
                    </Box>
                </Menu>

                <Box
                    className="sidebar-footer"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "left",
                        mt: "auto",
                    }}
                >
                    <LogoutIcon
                        onClick={() => {
                            signOutClearAll?.();
                            navigate("/login");
                        }}
                        sx={{
                            backgroundColor: "black",
                            height: 40,
                            width: 40,
                            padding: 1.2,
                            borderRadius: 8,
                            color: "white",
                            cursor: "pointer",
                        }}
                    />
                </Box>
            </div>
        </Sidebar>
    );
};

export default SidebarCustom;