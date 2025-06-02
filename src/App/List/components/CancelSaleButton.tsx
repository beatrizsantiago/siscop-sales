import { useState } from 'react';
import { Box, Button, Dialog, Typography } from '@mui/material';
import Sale from '@domain/entities/Sale';

type Props = {
  sale: Sale,
};

const CancelSaleButton = ({ sale }:Props) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleCancelSale = () => {
    console.log('Sale cancelled');
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => setShowDialog(true)}
      >
        Cancelar venda
      </Button>

      {showDialog && (
        <Dialog
          open
          onClose={() => setShowDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <Typography variant="h6" fontWeight={600} marginBottom={2} align="center" lineHeight={1.2}>
            Tem certeza que deseja cancelar a venda de
            {' '}
            <b>
              {sale.farm.name}
            </b>
            ?
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" marginBottom={3}>
            Esta ação não poderá ser desfeita.
          </Typography>

          <Box display="flex" gap={3}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowDialog(false)}
              fullWidth
            >
              Fechar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCancelSale}
              fullWidth
            >
              Cancelar venda
            </Button>
          </Box>
        </Dialog>
      )}
    </>
  );
};

export default CancelSaleButton;
