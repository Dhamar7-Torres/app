export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString();

export const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
