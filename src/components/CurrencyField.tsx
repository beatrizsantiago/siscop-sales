import { TextField, TextFieldProps } from '@mui/material';

type Props = TextFieldProps & {
  value: string;
  onChange: (value: string) => void;
};

const CurrencyField = ({ value, onChange, ...props }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let number = parseInt(inputValue.replace(/[^0-9]/g, ''), 10);
    if (Number.isNaN(number)) number = 0;

    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
    }).format(number / 100.0);

    onChange(formattedValue);
  };

  return (
    <TextField
      {...props}
      value={value}
      onChange={handleChange}
      inputMode="numeric"
      fullWidth
      slotProps={{
        htmlInput: {
          maxLength: 13,
          'data-testid': 'currency-input'
        },
      }}
    />
  );
};

export default CurrencyField;
