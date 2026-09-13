import { useEffect, useState } from "react";
import Header from "../../components/header";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import { localizedTextsMap } from "../../utils/localeTextTable";

import {
  Box,
  Modal,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";

import { Edit } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import MembroService from "../../services/MembroService";
import CustomToolbar from "../../components/CustomMui/CustomToolbar";

const Membros = () => {
  const navigate = useNavigate();
  const [membros, setMembros] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [membroSelecionado] = useState<any>(null);

  // Busca os membros automaticamente ao abrir a tela
  useEffect(() => {
    let active = true;
    MembroService.listarMembros({})
      .then((resp) => {
        if (active) setMembros(Array.isArray(resp) ? resp : []);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // colunas exibidas na lista
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
      cellClassName: "sociedade-column--cell",
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

  // Editar Membro
  const MatEdit = ({ index }: any) => {
    const handleEditClick = () => {
      navigate("/cadastrar-membro", {
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
          title="Membros"
        />

        {isNonMobile && (
          <Box>
              <Link
                to={"/cadastrar-membro"}
                style={{ textDecoration: "none", marginRight: 1 }}
              >
                <Button
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
            {/* )} */}
          </Box>
        )}
      {/*  */}

      {!isNonMobile && (
        <Box sx={{ display: "flex" }}>
            <Link
              to={"/cadastrar-membro"}
              style={{ textDecoration: "none", marginRight: 1 }}
            >
              <Button
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
      <Box sx={{ m: "40px 0 0 0", minHeight: "75vh" }}>
        <DataGrid
          rows={membros}
          columns={columns}
          localeText={localizedTextsMap}
          loading={loading}
          slots={isNonMobile ? { toolbar: () => CustomToolbar(columns) } : {}}
        />
      </Box>
      {/*  */}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "rgba(0,0,0, 0.2)",
            boxShadow: 24,
            borderRadius: "10px",
          }}
        >
          <img
            src={membroSelecionado}
            alt="membro"
            style={{
              width: "400px",
              height: "500px",
              borderRadius: "10px",
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Membros;