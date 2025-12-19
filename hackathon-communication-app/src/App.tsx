import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommunicationList from './components/CommunicationList';
import CommunicationSender from './components/CommunicationSender';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4263eb',
    },
    secondary: {
      main: '#679d12',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<CommunicationList />} />
          <Route path="/send" element={<CommunicationSender />} />
        </Routes>
      </Router>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
