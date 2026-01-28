
    import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Box, IconButton, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import mailService from '../services/mailService';
import Loading from './Loading';

const CommunicationHistory: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]); // Use a interface do Log se tiver
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const fetchHistory = async () => {
    try {
      const data = await mailService.sentEmails();
      console.log("DADOS REAIS DO BANCO:", data); // <--- ABRA O F12 E VEJA ISSO
      setHistory(data);
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
    } finally {
      setIsLoading(false);
    }
  };
  fetchHistory();
}, []);

  if (isLoading) return <Loading />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate('/')} sx={{ color: '#125E97' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h4" gutterBottom sx={{ fontFamily: 'Oxanium, serif', fontSize: '2rem', fontWeight: 'bold', color: '#125E97' }}>
          Histórico de Envios
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Destinatário</TableCell>
              <TableCell>Assunto</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Nenhum envio registrado.</TableCell>
              </TableRow>
            ) : (
              history.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>{new Date(log.sentAt).toLocaleString('pt-BR')}</TableCell>
                  <TableCell>{log.recipient}</TableCell>
                  <TableCell>{log.subject}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={log.success ? "Enviado" : "Falha"} 
                      color={log.success ? "success" : "error"} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CommunicationHistory;