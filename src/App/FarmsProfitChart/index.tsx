import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useSaleContext } from '@App/context';
import { Box, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const FarmsProfitChart = () => {
  const { state } = useSaleContext();

  if (state.farmsProfit.length === 0) return null;

  return (
    <Box
      width={{ xs: '100%', md: '50%' }}
      bgcolor="#FFF"
      padding={2}
      borderRadius={2}
    >
      <Typography fontWeight={600}>
        Lucro por Fazenda
      </Typography>

      <Box
        display="flex"
        justifyContent="center"
        maxHeight={350}
      >
        <Doughnut
          data={{
            labels: state.farmsProfit.map((data) => (data).farmName),
            datasets: [{
              label: 'Lucro Total (R$)',
              data: state.farmsProfit.map((data) => (data).profit),
              backgroundColor: [
                '#8BC34A',
                '#36A2EB',
                '#FF6384',
                '#4BC0C0',
                '#FFCE56',
                '#00BCD4',
                '#F44336',
                '#9966FF',
                '#E91E63',
                '#FF9F40',
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

export default FarmsProfitChart;
