export const calculatePercentage = (value: number, total: number) =>
  total > 0 ? (value / total) * 100 : 0;
