import React, { useState } from 'react';
import {
  Box, Button, TextField, Grid,
  CircularProgress, Autocomplete,
  IconButton, Typography,
} from '@mui/material';
import { useSaleContext } from '@App/context';
import { toast } from 'react-toastify';
import { TrashIcon } from '@phosphor-icons/react';
import { money, parseStringNumberToFloat } from '@utils/currencyFormats';
import { firebaseSale } from '@fb/sale';
import { firebaseKardex } from '@fb/kardex';
import AddSaleUseCase from '@usecases/sale/add';
import useGetFarms from '@hooks/useGetFarms';
import CurrencyField from '@components/CurrencyField';
import Farm from '@domain/entities/Farm';
import Product from '@domain/entities/Product';

type ItemType = {
  amount: number;
  product: Product | null
  unit_value: number;
}
type Props = {
  handleClose: () => void;
};

const FormContainer = ({ handleClose }:Props) => {
  const { dispatch, getProductProfit, getFarmsProfit } = useSaleContext();

  const { farms, loading: farmsLoading } = useGetFarms();

  const [loading, setLoading] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [itemsList, setItemsList] = useState<ItemType[]>([{
    amount: 0,
    product: null,
    unit_value: 0,
  }]);

  const clearData = () => {
    setItemsList([{
      amount: 0,
      product: null,
      unit_value: 0,
    }]);
    setSelectedFarm(null);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (itemsList.some((item) => item.product === null || item.amount <= 0 || item.unit_value <= 0)) {
      toast.error('Todos os produtos devem ser selecionados e ter uma quantidade e valor maior que zero.');
      return;
    }

    setLoading(true);

    try {
      const addUseCase = new AddSaleUseCase(firebaseSale, firebaseKardex);
      const response = await addUseCase.execute({
        items: itemsList
          .map((item) => ({
            amount: item.amount,
            product: item.product as Product,
            unit_value: item.unit_value,
          })),
        farm: selectedFarm as Farm,
      });

      dispatch({
        type: 'ADD_SALE',
        item: response,
      });

      toast.success('Venda realizada com sucesso!');
      clearData();
      getProductProfit();
      getFarmsProfit();
      handleClose();
    } catch (error: any) {
      if ('message' in error && typeof error.message === 'string' && error.message.includes('INSUFFICIENT_STOCK')) {
        const productName = error.message.split(':')[1];
        toast.error(`Estoque insuficiente para o produto ${productName}.`);
        return;
      }
      
      toast.error('Erro ao realizar a venda. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (index: number, product: Product | null) => {
    const updatedItemsList = [...itemsList];

    if (!product) {
      updatedItemsList[index] = {
        amount: 0,
        product: null,
        unit_value: 0,
      };
      setItemsList(updatedItemsList);
      return;
    }

    const defaultUnitValue = selectedFarm?.available_products.find((p) => p.id === product?.id)?.unit_value || 0;

    updatedItemsList[index].product = product;
    updatedItemsList[index].unit_value = defaultUnitValue;
    setItemsList(updatedItemsList);
  };

  const handleAmountChange = (index: number, amount: number) => {
    const updatedItemsList = [...itemsList];
    updatedItemsList[index].amount = amount;
    setItemsList(updatedItemsList);
  };

  const handleUnitValueChange = (index: number, unitValue: number) => {
    const updatedItemsList = [...itemsList];
    updatedItemsList[index].unit_value = unitValue;
    setItemsList(updatedItemsList);
  };

  const onAddItemClick = () => {
    setItemsList([
      ...itemsList,
      {
        amount: 0,
        product: null,
        unit_value: 0,
      },
    ]);
  };

  const onDeleteItemClick = (index: number) => {
    const updatedItemsList = itemsList.filter((_, i) => i !== index);
    setItemsList(updatedItemsList);
  };

  const onCancelClick = () => {
    clearData();
    handleClose();
  };

  if (farmsLoading) return <CircularProgress />;

  const lastItem = itemsList[itemsList.length - 1];
  const availableProductsList = selectedFarm
    ? selectedFarm.available_products.filter(
      (product) => !itemsList.some((item) => item.product?.id === product.id),
    ) : [];

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Autocomplete
            value={selectedFarm}
            onChange={(_, newValue) => {
              setSelectedFarm(newValue);
            }}
            options={farms}
            renderInput={(params) => <TextField {...params} label="Selecione a fazenda" variant="standard" required />}
            getOptionLabel={(option) => option.name}
          />
        </Grid>

        {selectedFarm && selectedFarm.available_products.length === 0 && (
          <Grid size={12}>
            <Typography align="center" color="error">
              Não há produtos prontos para venda nesta fazenda.
            </Typography>
          </Grid>
        )}

        {selectedFarm && selectedFarm.available_products.length > 0 && (
          <>
            {itemsList.map((item, index) => (
              <React.Fragment key={index}>
                <Grid size={{ xs: 12, md: 5}}>
                  <Autocomplete
                    options={availableProductsList}
                    renderInput={(params) => <TextField {...params} label="Selecione o produto" variant="standard" required />}
                    getOptionLabel={(option) => option.name}
                    value={item.product}
                    onChange={(_, newValue) => handleSelectProduct(index, newValue)}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 3}}>
                  <TextField
                    label="Quantidade"
                    variant="standard"
                    type="number"
                    value={item.amount || ''}
                    onChange={(e) => handleAmountChange(index, Number(e.target.value))}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 3}}>
                  <CurrencyField
                    label="Valor unitário"
                    variant="standard"
                    value={money(item.unit_value)}
                    onChange={(e) => handleUnitValueChange(index, parseStringNumberToFloat(e as string))}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 1 }}>
                  <Box display={{ xs: 'flex', md: 'none' }} justifyContent="center">
                    <Button
                      color="error"
                      onClick={() => onDeleteItemClick(index)}
                      disabled={itemsList.length <= 1}
                      variant="outlined"
                    >
                      Excluir item
                    </Button>
                  </Box>
                  <Box display={{ xs: 'none', md: 'flex' }} alignItems="flex-end" justifyContent="center" height="100%">
                    <IconButton
                      sx={{ color: 'error.main' }}
                      onClick={() => onDeleteItemClick(index)}
                      disabled={itemsList.length <= 1}
                    >
                      <TrashIcon size={20} />
                    </IconButton>
                  </Box>
                </Grid>
              </React.Fragment>
            ))}

            {itemsList.length < selectedFarm.available_products.length && (
              <Grid size={12}>
                <Box display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={lastItem.product === null || lastItem.amount <= 0 || lastItem.unit_value <= 0}
                    loading={loading}
                    loadingPosition="start"
                    onClick={onAddItemClick}
                  >
                    Adicionar item
                  </Button>
                </Box>
              </Grid>
            )}
          </>
        )}
      </Grid>

      <Box marginTop={4} display="flex" justifyContent="space-between">
        <Button onClick={onCancelClick} variant="outlined" color="error">
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          loading={loading}
          loadingPosition="start"
        >
          Salvar
        </Button>
      </Box>
    </form>
  );
}

export default FormContainer;
