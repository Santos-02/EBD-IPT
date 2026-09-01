import { useForm } from "react-hook-form";
import Header from "../../../components/header";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Tabs,
  Tab,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import MembroService from "../../../services/MembroService";
import { TabPanel, a11yProps } from "../../../components/tabPanel";

const Society = {
  UCP: "UCP",
  UPA: "UPA",
  UMP: "UMP",
  UPH: "UPH",
  SAF: "SAF",
} as const;

const CadastrarMembro = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (state) {
      setValue("nome", state.nome);
      setValue("sociedade", state.sociedade);
    }
  }, [setValue, state]);

  const salvar = async (values: any) => {
    setLoading(true);

    MembroService.salvarMembro(values)
      .then((resp: any) => {
        if (resp == "201") {
          window.alert("Membro cadastrado com sucesso!");
          setTimeout(() => {
            navigate("/membros");
          }, 1000);
        } else {
          window.alert("Erro ao cadastrar membro!");
        }
      })
      .catch((e) => {
        window.alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const editar = async (values: any) => {
    setLoading(true);

    MembroService.editarMembro(values, state.id)
      .then((resp: any) => {
        if (resp == "204") {
          window.alert("Membro editado com sucesso!");
          setTimeout(() => {
            navigate("/membros");
          }, 1000);
        } else {
          window.alert("Erro ao editar membro!");
        }
      })
      .catch((e) => {
        window.alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box m="20px">
      <Header
        title={state ? "Editar Membro" : "Cadastrar Membro"}
        subtitle={state ? `Membro ID ${state.id}` : ""}
      />
      <Tabs value={0}>
        <Tab label="Dados Básicos" {...a11yProps(0)} />
      </Tabs>

      <TabPanel value={0} index={0}>
        <form onSubmit={handleSubmit(state ? editar : salvar)}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": {
                gridColumn: isNonMobile ? undefined : "span 4",
              },
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              type="text"
              label="Nome"
              {...register("nome", {
                required: true,
              })}
              error={!!errors.nome}
              helperText={errors.nome ? "Nome é obrigatório" : ""}
              sx={{ gridColumn: "span 2" }}
            />

            <TextField
              fullWidth
              select
              variant="outlined"
              defaultValue=""
              label="Sociedade"
              {...register("sociedade", {
                required: true,
              })}
              error={!!errors.sociedade}
              helperText={errors.sociedade ? "Sociedade é obrigatória" : ""}
              sx={{ gridColumn: "span 2" }}
            >
              <MenuItem value="" disabled>
                Selecione a sociedade
              </MenuItem>
              {(Object.keys(Society) as Array<keyof typeof Society>).map(
                (key) => (
                  <MenuItem key={key} value={Society[key]}>
                    {Society[key]}
                  </MenuItem>
                )
              )}
            </TextField>
          </Box>

          <Box display="flex" justifyContent="end" mt="20px">
            <Button
              disabled={loading}
              type="submit"
              color="primary"
              variant="contained"
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Salvar"
              )}
            </Button>
          </Box>
        </form>
      </TabPanel>
    </Box>
  );
};

export default CadastrarMembro;
