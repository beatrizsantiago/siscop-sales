import { Box, Button, CircularProgress } from '@mui/material';

import { useSaleContext } from '../context';
import Sale from './components/Sale';

const List = () => {
  const { state, getMoreSale } = useSaleContext();

  return (
    <Box>
      {state.list.map((item) => (
        <Sale key={item.id} sale={item} />
      ))}

      {state.loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      {state.hasMore && !state.loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" color="secondary" onClick={getMoreSale}>
            Carregar mais
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default List;
