import { theme } from 'agro-core';
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import { SaleProvider } from './context';
import Main from './Main';

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <SaleProvider>
      <Main />
    </SaleProvider>
    <ToastContainer />
  </ThemeProvider>
);

export default App;
