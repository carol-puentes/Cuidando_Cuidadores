// utils/progressUtils.js
export const obtenerSemanasDesbloqueadas = (progreso) => {
  const maxSemanaDesbloqueada = progreso?.ultimaSemanaCompletada || 0;
  return Array.from({ length: 8 }, (_, i) => ({
    semana: i + 1,
    desbloqueada: i <= maxSemanaDesbloqueada
  }));
};
