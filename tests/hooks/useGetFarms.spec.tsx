import { render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import useGetFarms from '../../src/hooks/useGetFarms';
import GetAllFarmsUseCase from '../../src/usecases/farm/getAllFarms';
import Farm from '../../src/domain/entities/Farm';

jest.mock('../../src/usecases/farm/getAllFarms', () => {
  return jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  }));
});

const TestComponent = () => {
  const { farms, loading } = useGetFarms();

  return (
    <div>
      {loading && <p>Loading...</p>}
      <ul>
        {farms.map((farm) => (
          <li key={farm.id}>{farm.name}</li>
        ))}
      </ul>
    </div>
  );
};

describe('useGetFarms hook', () => {
  it('should show farms', async () => {
    const fakeFarms: Farm[] = [
      new Farm('1', 'Fazenda 1', { _lat: 0, _long: 0 }, []),
      new Farm('2', 'Fazenda 2', { _lat: 0, _long: 0 }, []),
    ];

    (GetAllFarmsUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(fakeFarms),
    }));

    render(<TestComponent />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Fazenda 1')).toBeInTheDocument();
      expect(screen.getByText('Fazenda 2')).toBeInTheDocument();
    });
  });

  it('show error when fails', async () => {
    (GetAllFarmsUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error('Erro')),
    }));

    render(<TestComponent />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao carregar as fazendas');
    });
  });
});
