import { render, screen, fireEvent } from '@testing-library/react';
import Add from '../../../src/App/Add';

jest.mock('../../../src/App/Add/components/Form', () => ({ handleClose }: any) => (
  <div data-testid="mock-form">
    <button onClick={handleClose}>Fechar</button>
  </div>
));

describe('<Add />', () => {
  it('should open and close the dialog when button is clicked', () => {
    render(<Add />);

    const openButton = screen.getByRole('button', { name: /adicionar/i });
    expect(openButton).toBeInTheDocument();

    fireEvent.click(openButton);
    expect(screen.getByText(/nova venda/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-form')).toBeInTheDocument();

    const closeButton = screen.getByText('Fechar');
    fireEvent.click(closeButton);
    expect(screen.queryByText(/nova venda/i)).not.toBeInTheDocument();
  });
});
