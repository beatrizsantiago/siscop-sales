import { Box, Typography } from '@mui/material';
import List from '@App/List';
import Add from '@App/Add';

const Main = () => (
  <Box padding={2}>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-end"
      marginBottom={2}
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
