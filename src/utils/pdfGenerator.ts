import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import imageJpg from "../assets/image.jpg";

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

const carregarImagem = (): Promise<string> => {
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
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = () => reject(new Error("Falha ao carregar a imagem."));
    img.src = imageJpg;
  });
};

const adicionarCabecalho = (doc: jsPDF, imagem: string, subtitulo: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.addImage(imagem, "JPEG", 15, 15, 25, 25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Relatório de presenças na", 48, 24);
  doc.text("Escola Bíblica Dominical", 48, 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(subtitulo, 48, 40);

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