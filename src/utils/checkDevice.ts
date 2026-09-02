// Retorna verdadeiro quando o dispositivo é mobile (largura < 600px)
export const checkDevice = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  return window.innerWidth < 600;
};