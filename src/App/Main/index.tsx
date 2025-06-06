import { Box, Typography } from '@mui/material';
import List from '@App/List';
import Add from '@App/Add';
import ProductProfitChart from '@App/ProductProfitChart';
import FarmsProfitChart from '@App/FarmsProfitChart';

const Main = () => (
  <Box padding={2}>
    <Box display="flex" gap={3} flexWrap={{ xs: "wrap", md: 'nowrap' }}>
      <ProductProfitChart />
      <FarmsProfitChart />
    </Box>

    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-end"
      marginBottom={2}
      marginTop={4}
      width="100%"
    >
      <Typography variant="h5" fontWeight={600} lineHeight={1}>
        Últimas vendas
      </Typography>
      <Add />
    </Box>
    

    <List />
  </Box>
);

export default Main;
