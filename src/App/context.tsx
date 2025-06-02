import {
  useContext, createContext, useMemo, useReducer,
  useRef, useEffect, useCallback,
} from 'react';
import { firebaseSale } from '@fb/sale';
import { toast } from 'react-toastify';
import GetSaleUseCase from '@usecases/sale/getAllPaginated';

import { SaleProviderProps, SaleProviderType, State } from './types';
import reducer from './reducer';

const initialState:State = {
  list: [],
  lastDoc: undefined,
  hasMore: false,
  loading: true,
};

const Context = createContext({} as SaleProviderType);
const useSaleContext = ():SaleProviderType => useContext(Context);

const SaleProvider = ({ children }: SaleProviderProps) => {
  const initialized = useRef(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const getSale = useCallback(async () => {
    try {
      const getUserCase = new GetSaleUseCase(firebaseSale);
      const data = await getUserCase.execute();
      
      dispatch({
        type: 'SET_SALES',
        ...data,
      });
    } catch {
      toast.error('Erro ao carregar as vendas. Tente novamente mais tarde.');
    }
  }, []);

  const getMoreSale = useCallback(async () => {
    if (!state.hasMore || state.loading) return;

    dispatch({ type: 'SET_LOADING', loading: true });

    try {
      const getUserCase = new GetSaleUseCase(firebaseSale);
      const data = await getUserCase.execute(state.lastDoc);

      dispatch({
        type: 'SET_SALES',
        ...data,
      });
    } catch {
      toast.error('Erro ao carregar mais vendas. Tente novamente mais tarde.');
    }
  }, [state.hasMore, state.lastDoc, state.loading]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getSale();
    }
  }, [getSale]);

  const value = useMemo(() => ({
    state,
    dispatch,
    getMoreSale,
  }), [state, getMoreSale]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export { SaleProvider, useSaleContext };
