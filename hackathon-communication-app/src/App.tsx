import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommunicationList from './components/CommunicationList';
import CommunicationSender from './components/CommunicationSender';
import CommunicationHistory from './components/CommunicationHistory';

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
      fontSize: 16.5,
      fontWeightMedium: 600,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<CommunicationList darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/send" element={<CommunicationSender />} />
          <Route path="sent-emails" element={<CommunicationHistory />} />
        </Routes>
      </Router>
      <ToastContainer />
     
    </ThemeProvider>
  );
};

export default App;