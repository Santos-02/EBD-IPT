import supabase from "../api/supabaseClient";
import exceptionHandler from "../utils/ExceptionHandler";

interface PresencaRow {
  member_id: number;
  date: string;
}

interface MemberRow {
  id: number;
  name: string;
}

interface PresencaDia {
  nome: string;
}

interface PresencaMes {
  nome: string;
  datas: string[];
}

const listarPresencasPorDia = async (
  sociedade: string,
  date: string
): Promise<PresencaDia[] | string> => {
  try {
    const { data: presencas, error: presError } = await supabase
      .from("presences")
      .select("member_id")
      .eq("society", sociedade)
      .eq("date", date);

    if (presError) return presError.message;

    if (!presencas || presencas.length === 0) return [];

    const memberIds = (presencas as { member_id: number }[]).map(
      (p) => p.member_id
    );

    const { data: membros, error: memError } = await supabase
      .from("member")
      .select("id, name")
      .in("id", memberIds);

    if (memError) return memError.message;

    const mapa = new Map<number, string>(
      (membros as { id: number; name: string }[]).map((m) => [m.id, m.name])
    );

    return memberIds
      .map((id: number) => ({ nome: mapa.get(id) || "Desconhecido" }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  } catch (error) {
    return exceptionHandler(error);
  }
};

const listarPresencasPorMes = async (
  sociedade: string,
  mes: number,
  ano: number
): Promise<{ domingos: string[]; membros: PresencaMes[] } | string> => {
  try {
    const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
    const fimMes = new Date(ano, mes, 0).getDate();
    const fim = `${ano}-${String(mes).padStart(2, "0")}-${String(fimMes).padStart(2, "0")}`;

    const { data: presencas, error: presError } = await supabase
      .from("presences")
      .select("member_id, date")
      .eq("society", sociedade)
      .gte("date", inicio)
      .lte("date", fim);

    if (presError) return presError.message;

    if (!presencas || presencas.length === 0) {
      return { domingos: [], membros: [] };
    }

    const domingosSet = new Set<string>();
    const membrosMap = new Map<number, Set<string>>();

    for (const p of presencas as PresencaRow[]) {
      const d = new Date(`${p.date}T00:00:00`);
      if (d.getDay() === 0) {
        domingosSet.add(p.date);
      }
      if (!membrosMap.has(p.member_id)) {
        membrosMap.set(p.member_id, new Set());
      }
      membrosMap.get(p.member_id)!.add(p.date);
    }

    const domingos = Array.from(domingosSet).sort();

    const memberIds = Array.from(membrosMap.keys());
    const { data: membros, error: memError } = await supabase
      .from("member")
      .select("id, name")
      .in("id", memberIds);

    if (memError) return memError.message;

    const nomeMap = new Map<number, string>(
      (membros as MemberRow[]).map((m) => [m.id, m.name])
    );

    const membrosResult: PresencaMes[] = memberIds
      .map((id) => ({
        nome: nomeMap.get(id) || "Desconhecido",
        datas: Array.from(membrosMap.get(id) || []),
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome));

    return { domingos, membros: membrosResult };
  } catch (error) {
    return exceptionHandler(error);
  }
};

export default {
  listarPresencasPorDia,
  listarPresencasPorMes,
};
