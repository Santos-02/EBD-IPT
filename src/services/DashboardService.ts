import supabase from "../api/supabaseClient";

const SOCIEDADES = ["UCP", "UPA", "UMP", "UPH", "SAF"];

// Retorna a contagem de membros por sociedade para os gráficos
const listarMembrosPorSociedade = async () => {
    try {
const { data, error } = await supabase
            .from('member')
            .select('society');

        if (error) {
            console.error(error.message);
            return [];
        }

        return SOCIEDADES.map((sociedade) => ({
            society: sociedade,
            total: data.filter((item: any) => item.society === sociedade).length,
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Retorna a contagem de membros e usuários
const listarResumo = async () => {
    try {
        const [membros, usuarios] = await Promise.all([
            supabase.from('member').select('id', { count: 'exact', head: true }),
            supabase.from('users').select('id', { count: 'exact', head: true }),
        ]);

        if (membros.error) {
            console.error(membros.error.message);
            return { totalMembros: 0, totalUsuarios: 0 };
        }

        if (usuarios.error) {
            console.error(usuarios.error.message);
            return { totalMembros: 0, totalUsuarios: 0 };
        }

        return {
            totalMembros: membros.count,
            totalUsuarios: usuarios.count,
        };
    } catch (error) {
        console.error(error);
        return { totalMembros: 0, totalUsuarios: 0 };
    }
};

// Retorna o total de presenças por data (últimas N datas, ordenado cronologicamente)
const listarPresencasPorData = async (limite = 15) => {
    try {
        const { data, error } = await supabase
            .from('attendance')
            .select('date');

        if (error) {
            console.error(error.message);
            return [];
        }

        if (!Array.isArray(data)) {
            return [];
        }

        const totais: Record<string, number> = {};
        data.forEach((item: any) => {
            totais[item.date] = (totais[item.date] || 0) + 1;
        });

        return Object.keys(totais)
            .map((date) => ({ date, total: totais[date] }))
            .sort((a, b) => (a.date > b.date ? -1 : 1))
            .slice(0, limite)
            .sort((a, b) => (a.date < b.date ? -1 : 1));
    } catch (error) {
        console.error(error);
        return [];
    }
};

export default {
    listarMembrosPorSociedade,
    listarResumo,
    listarPresencasPorData,
};