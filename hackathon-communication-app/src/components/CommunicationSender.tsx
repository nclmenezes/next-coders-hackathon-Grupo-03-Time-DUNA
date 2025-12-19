import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Chip,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import mailService from '../services/mailService';
import Loading from './Loading';
import {
  showLoadingToast,
  dismissToast,
  showSuccessToast,
  showNotFoundErrorToast,
} from '../utils/toast';

interface Email {
  name: string;
  email: string;
}

const CommunicationSender: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { selectedEmails: Email[] } | undefined;
  const selectedEmails = state?.selectedEmails || [];
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!message.trim()) {
      showNotFoundErrorToast('Digite uma mensagem para enviar');
      return;
    }

    setIsLoading(true);
    const toastId = showLoadingToast('Enviando...');

    const payload = {
      name: selectedEmails.map(email => email.name).join('; '),
      to: selectedEmails.map(email => email.email).join('; '),
      type: 12,
      message: message,
    };

    try {
      const result = await mailService.sendCommunication(payload);
      dismissToast(toastId);
      
      if (result === 200) {
        showSuccessToast('Email enviado com sucesso!');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        showNotFoundErrorToast('Erro ao enviar email!');
      }
    } catch (error) {
      dismissToast(toastId);
      showNotFoundErrorToast('Erro ao enviar email!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Envio de Emails Next Coders
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {/* Recipients */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Destinatários ({selectedEmails.length})
          </Typography>
          <Box
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 1,
              minHeight: 60,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {selectedEmails.map((email, index) => (
              <Chip
                key={index}
                label={email.email}
                color="primary"
                sx={{ color: 'white' }}
              />
            ))}
          </Box>
        </Box>

        {/* Message */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mensagem
          </Typography>
          <TextField
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            placeholder="Digite sua mensagem aqui..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ bgcolor: '#e38d23', '&:hover': { bgcolor: '#c87a1c' } }}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendEmail}
            sx={{ bgcolor: '#679d12', '&:hover': { bgcolor: '#558010' } }}
          >
            Enviar Email
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CommunicationSender;
