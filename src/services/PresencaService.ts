import supabase from "../api/supabaseClient";
import exceptionHandler from "../utils/ExceptionHandler";

// Retorna os ids dos membros presentes em (sociedade, date)
const listarPresenca = async ({ sociedade, date }: any) => {
    try {
        const { data, error } = await supabase
            .from('presences')
            .select('member_id')
            .eq('society', sociedade)
            .eq('date', date);

        if (error) {
            return error.message;
        }

        return Array.isArray(data) ? data.map((item: any) => item.member_id) : [];
    } catch (error) {
        return exceptionHandler(error);
    }
};

// Substitui a lista de presentes daquele domingo (sociedade, date) pelos presentes informados
const salvarPresenca = async ({ sociedade, date, presentes }: any) => {
    try {
        const { error: delError } = await supabase
            .from('presences')
            .delete()
            .eq('society', sociedade)
            .eq('date', date);

        if (delError) {
            return { success: false, message: delError.message };
        }

        if (presentes.length > 0) {
            const rows = presentes.map((memberId: any) => ({
                member_id: memberId,
                date,
                society: sociedade,
            }));

            const { error: insError } = await supabase
                .from('presences')
                .insert(rows);

            if (insError) {
                return { success: false, message: insError.message };
            }
        }

        return { success: true, message: 'Presença salva com sucesso!' };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Ocorreu um erro inesperado.',
        };
    }
};

// Retorna as datas já lançadas (somente domingos) com o total de presentes de cada uma
const listarDatas = async ({ sociedade }: any) => {
    try {
        const { data, error } = await supabase
            .from('presences')
            .select('date')
            .eq('society', sociedade);

        if (error) {
            return error.message;
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
            .filter((item) => new Date(`${item.date}T00:00:00`).getDay() === 0)
            .sort((a, b) => (a.date < b.date ? 1 : -1));
    } catch (error) {
        return exceptionHandler(error);
    }
};

export default {
    listarPresenca,
    listarDatas,
    salvarPresenca,
};