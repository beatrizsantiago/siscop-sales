import { render, screen } from '@testing-library/react';
import Main from '../../src/App/Main';

jest.mock('../../src/App/List', () => () => <div>Mocked List</div>);
jest.mock('../../src/App/Add', () => () => <button>Add Sale</button>);
jest.mock('../../src/App/ProductProfitChart', () => () => <div>Product Profit Chart</div>);
jest.mock('../../src/App/FarmsProfitChart', () => () => <div>Farms Profit Chart</div>);

describe('Main Component', () => {
  it('renders the profit charts', () => {
    render(<Main />);

    expect(screen.getByText('Product Profit Chart')).toBeInTheDocument();
    expect(screen.getByText('Farms Profit Chart')).toBeInTheDocument();
  });

  it('renders the title and add button', () => {
    render(<Main />);

    expect(screen.getByText('Últimas vendas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Sale/i })).toBeInTheDocument();
  });

  it('renders the sales list component', () => {
    render(<Main />);
    expect(screen.getByText('Mocked List')).toBeInTheDocument();
  });
});
