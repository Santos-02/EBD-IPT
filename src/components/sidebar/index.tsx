import logo from "../../assets/image.jpg";
import { useState, useContext } from "react";
import AuthContext from "../../context/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme, Box, useMediaQuery } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";

const SidebarCustom = ({ onMobileClose }: any) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const location = useLocation();
    const isMobile = useMediaQuery("(max-width:599px)");

    const [isCollapsed, setIsCollapsed] = useState(false);
    const signOutClearAll = useContext(AuthContext)?.signOutClearAll;

    const isDark = theme.palette.mode === "dark";

    const pathname = location.pathname;
    let selected = "";
    if (pathname === "/dashboard" || pathname.startsWith("/controle-presenca")) {
        selected = "Dashboard";
    } else if (pathname.startsWith("/membros") || pathname.startsWith("/cadastrar-membro")) {
        selected = "Membros";
    } else if (pathname.startsWith("/usuarios")) {
        selected = "Usuários";
    }

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
                            title="Usuários"
                            to="/usuarios"
                            icon={<PeopleOutlinedIcon fontSize="medium" />}
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