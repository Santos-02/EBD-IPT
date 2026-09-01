import supabase from "../api/supabaseClient";
import exceptionHandler from "../utils/ExceptionHandler";

// Usado para pesquisar membros de acordo com os filtros
const listarMembros = async (filtros: any) => {
    try {

        // Filtra os filtros vazios
        const where = Object.fromEntries(
            Object.entries(filtros).filter(([, value]) => value !== "")
        );

        // Inicia a consulta
        let query = supabase.from('membro').select("*");

        // Aplica os filtros dinamicamente
        for (const [key, value] of Object.entries(where)) {
            if (key === "nome") {
                query = query.ilike("name", `%${value}%`);
            } else if (key === "sociedade") {
                query = query.eq(key, value);
            }
        }

        const { data, error } = await query; // Executa a consulta

        if (error) {
            return error.message;
        }
        return data;

    } catch (error) {
        return exceptionHandler(error);
    }
};

const salvarMembro = async (membro: any) => {
    try {
        const { status, error } = await supabase
            .from('membro')
            .insert({
                name: membro.nome,
                society: membro.sociedade,
            });

        if (error) {
            return error.message;
        }

        return status;

    } catch (error: any) {
        return error.message || 'Ocorreu um erro inesperado.';
    }
};

const editarMembro = async (membro: any, id: any) => {
    try {
        const { status, error } = await supabase
            .from('membro')
            .update({
                name: membro.nome,
                society: membro.sociedade,
            })
            .eq('id', id);

        if (error) {
            return error.message;
        }

        return status;

    } catch (error: any) {
        return error.message || 'Erro desconhecido ao editar o membro';
    }
};

export default {
    salvarMembro,
    editarMembro,
    listarMembros,
};
