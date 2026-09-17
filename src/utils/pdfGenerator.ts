import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import logo from "../assets/logo.png";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const formatarDataBR = (dateStr: string): string => {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
};

const carregarImagem = (): Promise<{
  dataUrl: string;
  width: number;
  height: number;
}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Falha ao carregar a imagem."));
      ctx.drawImage(img, 0, 0);
      resolve({
        dataUrl: canvas.toDataURL("image/png"),
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = () => reject(new Error("Falha ao carregar a imagem."));
    img.src = logo;
  });
};

const adicionarCabecalho = (
  doc: jsPDF,
  imagem: { dataUrl: string; width: number; height: number },
  subtitulo: string
) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  const maxW = 25;
  const maxH = 22;
  const escala = Math.min(maxW / imagem.width, maxH / imagem.height);
  const logoW = imagem.width * escala;
  const logoH = imagem.height * escala;
  const logoY = 30 - logoH / 2;

  doc.addImage(imagem.dataUrl, "PNG", 15, logoY, logoW, logoH);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Igreja Presbiteriana de Teresópolis", 50, 32);
  doc.text("Relatório de presenças na EBD", 50, 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(subtitulo, 50, 40);

  doc.setDrawColor(0, 49, 29);
  doc.setLineWidth(0.5);
  doc.line(15, 45, pageWidth - 15, 45);

  return 52;
};

export const gerarPdfDia = async (
  sociedade: string,
  date: string,
  presentes: { nome: string }[]
) => {
  const imagem = await carregarImagem();
  const doc = new jsPDF();
  const subtitulo = `Data: ${formatarDataBR(date)} — Sociedade: ${sociedade}`;
  let y = adicionarCabecalho(doc, imagem, subtitulo);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Total de presentes: ${presentes.length}`, 15, y);
  y += 8;

  if (presentes.length === 0) {
    doc.text("Nenhum membro presente nesta data.", 15, y);
  } else {
    const body = presentes.map((p, i) => [String(i + 1), p.nome]);

    autoTable(doc, {
      startY: y,
      head: [["#", "Nome"]],
      body,
      styles: { font: "helvetica", fontSize: 10 },
      headStyles: { fillColor: [0, 49, 29], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 15, right: 15 },
    });
  }

  const dataFormatada = date.split("-").reverse().join("-");
  doc.save(`relatorio-${sociedade}-${dataFormatada}.pdf`);
};

export const gerarPdfMes = async (
  sociedade: string,
  mes: number,
  ano: number,
  domingos: string[],
  membros: { nome: string; datas: string[] }[]
) => {
  const imagem = await carregarImagem();
  const doc = new jsPDF({ orientation: "landscape" });
  const subtitulo = `Mês: ${MESES[mes - 1]}/${ano} — Sociedade: ${sociedade}`;
  let y = adicionarCabecalho(doc, imagem, subtitulo);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Total de membros presentes no mês: ${membros.length}`, 15, y);
  y += 8;

  if (membros.length === 0 || domingos.length === 0) {
    doc.text("Nenhum registro de presença neste mês.", 15, y);
  } else {
    const headerDomingos = domingos.map((d) => {
      const dia = d.split("-")[2];
      return dia;
    });

    const head = [["#", "Nome", ...headerDomingos]];

    const body = membros.map((m, i) => {
      const presencas = domingos.map((d) => (m.datas.includes(d) ? "X" : ""));
      return [String(i + 1), m.nome, ...presencas];
    });

    const colStyles: Record<string, { halign: "center" }> = {};
    headerDomingos.forEach((_, idx) => {
      colStyles[idx + 2] = { halign: "center" };
    });

    autoTable(doc, {
      startY: y,
      head,
      body,
      styles: { font: "helvetica", fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [0, 49, 29], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: colStyles,
      margin: { left: 15, right: 15 },
    });
  }

  doc.save(`relatorio-${sociedade}-${ano}-${String(mes).padStart(2, "0")}.pdf`);
};