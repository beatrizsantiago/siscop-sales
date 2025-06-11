import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useSaleContext } from '@App/context';
import { Box, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProductProfitChart = () => {
  const { state } = useSaleContext();

  if (state.productProfit.length === 0) return null;

  return (
    <Box
      width={{ xs: '100%', md: '50%' }}
      bgcolor="#FFF"
      padding={2}
      borderRadius={2}
    >
      <Typography fontWeight={600}>
        Lucro por Produto
      </Typography>

      <Box
        display="flex"
        justifyContent="center"
        maxHeight={350}
      >
        <Doughnut
          data={{
            labels: state.productProfit.map((data) => (data).productName),
            datasets: [{
              label: 'Lucro Total (R$)',
              data: state.productProfit.map((data) => (data).profit),
              backgroundColor: [
                '#E91E63',
                '#36A2EB',
                '#FF6384',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#8BC34A',
                '#F44336',
                '#00BCD4',
              ],
              borderColor: '#fff',
              borderWidth: 1,
            }]
          }}
        />
      </Box>
    </Box>
  );
};

export default ProductProfitChart;
