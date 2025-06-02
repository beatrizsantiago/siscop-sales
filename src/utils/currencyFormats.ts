export const money = (value?:number | null):string => (value
  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  : 'R$ 0,00');
  
export const parseStringNumberToFloat = (formattedValue: string): number => {
  const cleaned = formattedValue
    .replace(/\s/g, '')
    .replace('R$', '')
    .replace(/\./g, '')
    .replace(',', '.');

  const result = parseFloat(cleaned);
  return Number.isNaN(result) ? 0 : result;
};
