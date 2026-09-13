import { useEffect, useState } from "react";
import Header from "../../components/header";
import AddIcon from "@mui/icons-material/Add";
import { localizedTextsMap } from "../../utils/localeTextTable";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit } from "@mui/icons-material";
import UsuarioService from "../../services/UsuarioService";
import CustomToolbar from "../../components/CustomMui/CustomToolbar";

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // Busca os usuários automaticamente ao abrir a tela
  useEffect(() => {
    let active = true;
    UsuarioService.listarUsuarios({})
      .then((resp) => {
        if (active) setUsuarios(Array.isArray(resp) ? resp : []);
      })
      .catch((e) => {
        window.alert(e);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // colunas exibidas na lista
  const columns = [
    {
      field: "name",
      headerName: "Nome",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "editar",
      headerName: "Editar",
      sortable: false,
      width: 80,
      disableClickEventBubbling: true,
      renderCell: (params: any) => {
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <MatEdit index={params.row} />
          </div>
        );
      },
    },
  ];

  // Editar usuário
  const MatEdit = ({ index }: any) => {
    const handleEditClick = () => {
      navigate("/cadastrar-usuario", {
        state: index,
      });
    };

    return (
      <IconButton color="secondary" onClick={handleEditClick}>
        <Edit />
      </IconButton>
    );
  };

  return (
    <Box sx={{ m: { xs: 1.5, sm: 2.5 } }}>
      {/* Header */}
        <Header
          title="Usuários"
        />
        {isNonMobile && (
          <Box>

            <Link
              to={"/cadastrar-usuario"}
              style={{ textDecoration: "none", marginRight: 1 }}
            >
              <Button
                disabled={loading}
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "10px 20px",
                }}
              >
                <AddIcon sx={{ mr: "10px" }} />
                Novo
              </Button>
            </Link>
          </Box>
        )}
      {/*  */}

      {!isNonMobile && (
        <Box sx={{ display: "flex" }}>

          <Link
            to={"/cadastrar-usuario"}
            style={{ textDecoration: "none", marginRight: 1 }}
          >
            <Button
              disabled={loading}
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <AddIcon sx={{ mr: "10px" }} />
              Novo
            </Button>
          </Link>
        </Box>
      )}

      {/* Lista */}
      <Box sx={{ m: "40px 0 0 0", height: "75vh" }}>
        <DataGrid
          rows={usuarios}
          columns={columns}
          rowCount={usuarios.length}
          localeText={localizedTextsMap}
          loading={loading}
          slots={isNonMobile ? { toolbar: () => CustomToolbar(columns) } : {}}
        />
      </Box>
      {/*  */}

    </Box>
  );
};

export default Usuarios;