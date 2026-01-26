import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommunicationList from './components/CommunicationList';
import CommunicationSender from './components/CommunicationSender'; 
import {Button} from '@mui/material';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#4263eb' },
      secondary: { main: '#679d12' },
    },
    typography: {
      fontFamily: 'Rajdhani, sans-serif',
      fontSize: 17,
      fontWeightMedium: 600,
    },
  });

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
      {/* Exemplo de botão para alternar dark mode */}
      <Button onClick={() => setDarkMode(!darkMode)}
         sx={{ ml: 'auto', bgcolor: '#679d12', '&:hover': { bgcolor: '#558010' },color: 'white' }}> 
        Alternar para {darkMode ? 'Light' : 'Dark'} Mode
      </Button>
    </ThemeProvider>
  );
};

export default App;