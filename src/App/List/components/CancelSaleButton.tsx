import { useState } from 'react';
import { Box, Button, Dialog, Typography } from '@mui/material';
import { useSaleContext } from '@App/context';
import { firebaseSale } from '@fb/sale';
import { firebaseKardex } from '@fb/kardex';
import CalcelSaleUseCase from '@usecases/sale/cancel';
import Sale from '@domain/entities/Sale';
import { toast } from 'react-toastify';

type Props = {
  sale: Sale,
};

const CancelSaleButton = ({ sale }:Props) => {
  const { dispatch } = useSaleContext();

  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancelSale = async () => {
    setLoading(true);

    try {
      const cancelUseCase = new CalcelSaleUseCase(firebaseSale, firebaseKardex);
      await cancelUseCase.execute(sale.id);

      dispatch({
        type: 'CANCEL_SALE',
        id: sale.id,
      });

      toast.success('Venda cancelada com sucesso!');
      setShowDialog(false);
    } catch (error) {
      console.log('Error canceling sale:', error);
      
      toast.error('Erro ao cancelar a venda. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
            >
              Fechar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCancelSale}
              fullWidth
              loading={loading}
              loadingPosition="start"
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
