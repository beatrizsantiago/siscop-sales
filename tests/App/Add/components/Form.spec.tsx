import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { useSaleContext } from '../../../../src/App/context';
import FormContainer from '../../../../src/App/Add/components/Form';
import useGetFarms from '../../../../src/hooks/useGetFarms';
import AddSaleUseCase from '../../../../src/usecases/sale/add';
import Product from '../../../../src/domain/entities/Product';
import Farm from '../../../../src/domain/entities/Farm';

jest.mock('../../../../src/App/context');
jest.mock('../../../../src/hooks/useGetFarms');
jest.mock('../../../../src/usecases/sale/add');

describe('FormContainer', () => {
  const mockHandleClose = jest.fn();
  const mockDispatch = jest.fn();
  const mockGetProfit = jest.fn();

  const farmMock = new Farm(
    'farm1',
    'Fazenda Teste',
    { _lat: 0, _long: 0 },
    [new Product('prod1', 'Produto Teste', 10, 30)]
  );

  beforeEach(() => {
    (useSaleContext as jest.Mock).mockReturnValue({
      dispatch: mockDispatch,
      getProductProfit: mockGetProfit,
      getFarmsProfit: mockGetProfit,
    });

    (useGetFarms as jest.Mock).mockReturnValue({
      farms: [farmMock],
      loading: false,
    });

    (AddSaleUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue({
        id: 'venda1',
        ...farmMock,
        items: [],
        status: 'DONE',
        total_value: 0,
        created_at: new Date(),
      }),
    }));
  });

  it('should render the form and select a farm', async () => {
    render(<FormContainer handleClose={mockHandleClose} />);

    const farmInput = screen.getByLabelText(/Selecione a fazenda/i);
    fireEvent.change(farmInput, { target: { value: 'Fazenda Teste' } });
    fireEvent.click(screen.getByText('Fazenda Teste'));

    expect(await screen.findByText('Selecione o produto')).toBeInTheDocument();
  });

  it('should call AddSaleUseCase and dispatch on successful submit', async () => {
    render(<FormContainer handleClose={mockHandleClose} />);

    const farmInput = screen.getByLabelText(/Selecione a fazenda/i);
    fireEvent.change(farmInput, { target: { value: 'Fazenda Teste' } });
    fireEvent.click(screen.getByText('Fazenda Teste'));

    const productInput = await screen.findByLabelText(/Selecione o produto/i);
    fireEvent.change(productInput, { target: { value: 'Produto Teste' } });
    fireEvent.click(screen.getByText('Produto Teste'));

    fireEvent.change(screen.getByLabelText(/Quantidade/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Valor unitário/i), { target: { value: '10' } });

    const submit = screen.getByText('Salvar');
    fireEvent.click(submit);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });
});
