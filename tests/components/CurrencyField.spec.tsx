import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrencyField from '../../src/components/CurrencyField';

describe('<CurrencyField /> component', () => {
  it('should render with the initial value', () => {
    render(<CurrencyField value="R$ 0,00" onChange={jest.fn()} label="Amount" />);
    
    const input = screen.getByLabelText('Amount') as HTMLInputElement;
    expect(input.value).toBe('R$ 0,00');
  });

  it('should call onChange with the formatted value when typing', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<CurrencyField value="" onChange={handleChange} label="Amount" />);

    const input = screen.getByLabelText('Amount') as HTMLInputElement;

    await user.type(input, '1');

    expect(handleChange).toHaveBeenCalledWith('R$ 0,01');
  });
});
