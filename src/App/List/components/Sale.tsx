import React, { useState } from 'react';
import { Box, Paper, Typography, Collapse, Divider, Grid } from '@mui/material';
import { formatDate } from 'date-fns';
import { money } from '@utils/currencyFormats';
import Sale from '@domain/entities/Sale';

import CancelledStatusChip from './CancelledStatusChip';
import CancelSaleButton from './CancelSaleButton';

type Props = {
  sale: Sale,
};

const SaleItem = ({ sale }:Props) => {
  const [showDetails, setShowDetails] = useState(false);

  const isCancelled = sale.status === 'CANCELLED';

  return (
    <Paper elevation={0} sx={{ borderRadius: 3 }}>
      <Box
        p={2}
        mt={2}
        display="flex"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        justifyContent="space-between"
        onClick={() => setShowDetails(!showDetails)}
        sx={{ cursor: 'pointer' }}
      >
        <Box display="flex" alignItems="center" gap={2} flexDirection={{ xs: 'column-reverse', sm: 'row' }}>
          <Box>
            <Typography fontWeight={600}>
              {sale.farm.name}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
            >

              {formatDate(sale.created_at, "dd/MM/yyyy 'às' HH:mm'h'")}
            </Typography>
          </Box>
          {isCancelled && (
            <CancelledStatusChip />
          )}
        </Box>
        <Box>
          <Typography variant="body2" color="textSecondary">
            Valor total da venda
          </Typography>
          <Typography
            align="right"
            fontWeight={600}
            color={isCancelled ? "error.main" : 'textPrimary'}
            sx={{ textDecorationLine: isCancelled ? 'line-through' : 'none' }}
          >
            {money(sale.total_value)}
          </Typography>
        </Box>
      </Box>
      
      <Collapse in={showDetails} unmountOnExit>
        <Box px={2} pb={2}>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={3}>
              <Typography fontSize="0.75rem" color="textSecondary" fontWeight={600} lineHeight={1}>
                Nome
              </Typography>
            </Grid>
            <Grid size={3}>
              <Typography fontSize="0.75rem" color="textSecondary" fontWeight={600} lineHeight={1}>
                Quantidade
              </Typography>
            </Grid>
            <Grid size={3}>
              <Typography fontSize="0.75rem" color="textSecondary" fontWeight={600} lineHeight={1}>
                Valor unitário
              </Typography>
            </Grid>
            <Grid size={3}>
              <Typography fontSize="0.75rem" color="textSecondary" fontWeight={600} lineHeight={1}>
                Valor total
              </Typography>
            </Grid>

            {sale.items.map((item, index) => (
              <React.Fragment key={index}>
                <Grid size={3}>
                  <Typography variant="body2" fontWeight={600}>
                    {item.product.name}
                  </Typography>
                </Grid>
                <Grid size={3}>
                  <Typography variant="body2" fontWeight={600}>
                    {item.amount}
                  </Typography>
                </Grid>
                <Grid size={3}>
                  <Typography variant="body2" fontWeight={600}>
                    {money(item.unit_value)}
                  </Typography>
                </Grid>
                <Grid size={3}>
                  <Typography variant="body2" fontWeight={600}>
                    {money(item.total_value)}
                  </Typography>
                </Grid>
              </React.Fragment>
            ))}

            {!isCancelled && (
              <Grid size={12}>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <CancelSaleButton sale={sale} />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default SaleItem;
