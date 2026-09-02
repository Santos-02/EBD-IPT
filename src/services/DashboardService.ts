import supabase from "../api/supabaseClient";
import exceptionHandler from "../utils/ExceptionHandler";

const SOCIEDADES = ["UCP", "UPA", "UMP", "UPH", "SAF"];

// Retorna a contagem de membros por sociedade para os gráficos
const listarMembrosPorSociedade = async () => {
    try {
        const { data, error } = await supabase
            .from('membro')
            .select('society');

        if (error) {
            return error.message;
        }

        return SOCIEDADES.map((sociedade) => ({
            society: sociedade,
            total: data.filter((item: any) => item.society === sociedade).length,
        }));
    } catch (error) {
        return exceptionHandler(error);
    }
};

// Retorna a contagem de membros (total e ativos) e usuários
const listarResumo = async () => {
    try {
        const [membros, usuarios] = await Promise.all([
            supabase.from('membro').select('id', { count: 'exact', head: true }),
            supabase.from('usuario').select('status'),
        ]);

        if (membros.error) {
            return membros.error.message;
        }

        if (usuarios.error) {
            return usuarios.error.message;
        }

        return {
            totalMembros: membros.count,
            totalUsuarios: usuarios.data.length,
            usuariosAtivos: usuarios.data.filter((item: any) => item.status === true).length,
        };
    } catch (error) {
        return exceptionHandler(error);
    }
};

// Retorna os membros cadastrados mais recentemente
const listarMembrosRecentes = async () => {
    try {
        const { data, error } = await supabase
            .from('membro')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) {
            return error.message;
        }

        return data;
    } catch (error) {
        return exceptionHandler(error);
    }
};

export default {
    listarMembrosPorSociedade,
    listarResumo,
    listarMembrosRecentes,
};