import { render, screen, fireEvent } from '@testing-library/react';
import SaleItem from '../../../../src/App/List/components/Sale';
import Sale from '../../../../src/domain/entities/Sale';
import Farm from '../../../../src/domain/entities/Farm';
import Product from '../../../../src/domain/entities/Product';

jest.mock('../../../../src/App/List/components/CancelSaleButton', () => ({
  __esModule: true,
  default: jest.fn(() => <div>CancelSaleButton</div>),
}));

describe('SaleItem', () => {
  const mockSale = new Sale(
    'sale1',
    new Farm('farm1', 'Farm Test', { _lat: 0, _long: 0 }, []),
    'DONE',
    1000,
    [
      {
        amount: 2,
        product: new Product('prod1', 'Tomato', 10, 20),
        total_value: 20,
        unit_value: 10,
      },
    ],
    new Date('2024-01-01T12:00:00')
  );

  const cancelledSale = new Sale(
    'sale2',
    new Farm('farm2', 'Cancelled Farm', { _lat: 0, _long: 0 }, []),
    'CANCELLED',
    500,
    [
      {
        amount: 1,
        product: new Product('prod2', 'Potato', 5, 5),
        total_value: 5,
        unit_value: 5,
      },
    ],
    new Date('2024-01-01T12:00:00')
  );

  it('should render sale basic info', () => {
    render(<SaleItem sale={mockSale} />);
    expect(screen.getByText('Farm Test')).toBeInTheDocument();
    expect(screen.getByText(/Valor total da venda/i)).toBeInTheDocument();
    expect(screen.getByText('R$ 1.000,00')).toBeInTheDocument();
  });

  it('should toggle details when clicking header', () => {
    render(<SaleItem sale={mockSale} />);
    expect(screen.queryByText('Tomato')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Farm Test'));

    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('R$ 10,00')).toBeInTheDocument();
    expect(screen.getByText('R$ 20,00')).toBeInTheDocument();
    expect(screen.getByText('CancelSaleButton')).toBeInTheDocument();
  });

  it('should show CancelledStatusChip if status is CANCELLED', () => {
    render(<SaleItem sale={cancelledSale} />);
    expect(screen.getByText('Venda cancelada')).toBeInTheDocument();
  });

  it('should not show CancelSaleButton if sale is CANCELLED', () => {
    render(<SaleItem sale={cancelledSale} />);
    fireEvent.click(screen.getByText('Cancelled Farm'));
    expect(screen.queryByText('CancelSaleButton')).not.toBeInTheDocument();
  });

  it('should show strikethrough total when cancelled', () => {
    render(<SaleItem sale={cancelledSale} />);
    const total = screen.getByText('R$ 500,00');
    expect(total).toHaveStyle('text-decoration-line: line-through');
    expect(total).toHaveStyle('color: rgb(211, 47, 47)');
  });
});
