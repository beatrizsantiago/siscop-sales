import { render, screen, fireEvent } from '@testing-library/react';
import { useSaleContext } from '../../../src/App/context';
import List from '../../../src/App/List';
import Sale from '../../../src/domain/entities/Sale';
import Farm from '../../../src/domain/entities/Farm';
import Product from '../../../src/domain/entities/Product';

jest.mock('../../../src/App/context', () => ({
  useSaleContext: jest.fn(),
}));

jest.mock('../../../src/App/List/components/Sale', () => ({
  __esModule: true,
  default: ({ sale }: any) => <div>{`Sale: ${sale.id}`}</div>,
}));

describe('List Component', () => {
  const mockGetMoreSale = jest.fn();

  const sampleSale = new Sale(
    'sale1',
    new Farm('farm1', 'Farm 1', { _lat: 0, _long: 0 }, []),
    'DONE',
    100,
    [{
      product: new Product('prod1', 'Tomato', 5, 10),
      amount: 2,
      unit_value: 5,
      total_value: 10
    }],
    new Date()
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all sales from context', () => {
    (useSaleContext as jest.Mock).mockReturnValue({
      state: {
        list: [sampleSale],
        loading: false,
        hasMore: false,
      },
      getMoreSale: mockGetMoreSale,
    });

    render(<List />);
    expect(screen.getByText('Sale: sale1')).toBeInTheDocument();
  });

  it('should show loading indicator when loading is true', () => {
    (useSaleContext as jest.Mock).mockReturnValue({
      state: {
        list: [],
        loading: true,
        hasMore: false,
      },
      getMoreSale: mockGetMoreSale,
    });

    render(<List />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should show "Load More" button if hasMore is true and not loading', () => {
    (useSaleContext as jest.Mock).mockReturnValue({
      state: {
        list: [sampleSale],
        loading: false,
        hasMore: true,
      },
      getMoreSale: mockGetMoreSale,
    });

    render(<List />);
    const button = screen.getByRole('button', { name: /Carregar mais/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockGetMoreSale).toHaveBeenCalled();
  });

  it('should not show "Load More" if loading is true', () => {
    (useSaleContext as jest.Mock).mockReturnValue({
      state: {
        list: [],
        loading: true,
        hasMore: true,
      },
      getMoreSale: mockGetMoreSale,
    });

    render(<List />);
    expect(screen.queryByRole('button', { name: /Carregar mais/i })).not.toBeInTheDocument();
  });
});
