import { toast } from 'react-toastify';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSaleContext } from '../../../../src/App/context';
import CancelSaleButton from '../../../../src/App/List/components/CancelSaleButton';
import CalcelSaleUseCase from '../../../../src/usecases/sale/cancel';
import Sale from '../../../../src/domain/entities/Sale';
import Farm from '../../../../src/domain/entities/Farm';

jest.mock('../../../../src/App/context', () => ({
  useSaleContext: jest.fn(),
}));

jest.mock('../../../../src/usecases/sale/cancel');

const mockDispatch = jest.fn();
const mockGetProductProfit = jest.fn();
const mockGetFarmsProfit = jest.fn();

const mockSale = new Sale(
  'sale1',
  new Farm('farm1', 'Test Farm', { _lat: 0, _long: 0 }, []),
  'DONE',
  1000,
  [],
  new Date()
);

describe('CancelSaleButton', () => {
  beforeEach(() => {
    (useSaleContext as jest.Mock).mockReturnValue({
      dispatch: mockDispatch,
      getProductProfit: mockGetProductProfit,
      getFarmsProfit: mockGetFarmsProfit,
    });

    (CalcelSaleUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(undefined),
    }));
  });

  it('should execute the cancellation successfully', async () => {
    render(<CancelSaleButton sale={mockSale} />);
    fireEvent.click(screen.getByText('Cancelar venda'));

    fireEvent.click(screen.getAllByText('Cancelar venda')[1]);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'CANCEL_SALE', id: 'sale1' });
      expect(mockGetProductProfit).toHaveBeenCalled();
      expect(mockGetFarmsProfit).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Venda cancelada com sucesso!');
    });
  });

  it('should display an error toast if the cancellation fails', async () => {
    (CalcelSaleUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error('Error')),
    }));

    render(<CancelSaleButton sale={mockSale} />);
    fireEvent.click(screen.getByText('Cancelar venda'));
    fireEvent.click(screen.getAllByText('Cancelar venda')[1]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao cancelar a venda. Tente novamente mais tarde.');
    });
  });
});
