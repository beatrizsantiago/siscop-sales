import { Chip } from '@mui/material';

const CancelledStatusChip = () => (
  <Chip
    label="Venda cancelada"
    sx={{
      backgroundColor: 'error.light',
      fontWeight: 'bold',
      color: '#fff',
    }}
  />
);

export default CancelledStatusChip;
