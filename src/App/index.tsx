import { theme } from 'agro-core';
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import Main from './Main';

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
      <Main />
    <ToastContainer />
  </ThemeProvider>
);

export default App;
