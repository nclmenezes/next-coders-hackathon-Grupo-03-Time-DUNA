import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Container,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import { useNavigate } from 'react-router-dom';
import { Email } from '../types';
import mailService from '../services/mailService';
import Loading from './Loading';
import { showNotFoundErrorToast } from '../utils/toast';

const CommunicationList: React.FC = () => {
  const navigate = useNavigate();
  const [mailList, setMailList] = useState<Email[]>([]);
  const [filteredList, setFilteredList] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    loadEmails();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [mailList, nameFilter, classFilter, roleFilter]);

  const loadEmails = async () => {
    setIsLoading(true);
    const emails = await mailService.getMails();
    setMailList(emails);
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = mailList;

    if (nameFilter) {
      filtered = filtered.filter(email =>
        email.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (classFilter) {
      filtered = filtered.filter(email => email.class === classFilter);
    }

    if (roleFilter) {
      filtered = filtered.filter(email => email.role === roleFilter);
    }

    setFilteredList(filtered);
    setPage(0);
  };

  const handleSelectEmail = (email: Email) => {
    const newSelected = new Set(selectedEmails);
    const emailString = JSON.stringify({ name: email.name, email: email.email });

    if (newSelected.has(emailString)) {
      newSelected.delete(emailString);
    } else {
      newSelected.add(emailString);
    }

    setSelectedEmails(newSelected);
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allEmails = new Set(
        paginatedEmails.map(email => 
          JSON.stringify({ name: email.name, email: email.email })
        )
      );
      setSelectedEmails(allEmails);
    } else {
      setSelectedEmails(new Set());
    }
  };

  const handleSendClick = () => {
    if (selectedEmails.size === 0) {
      showNotFoundErrorToast('Selecione ao menos um email para enviar');
      return;
    }
    
    const emails = Array.from(selectedEmails).map(email => JSON.parse(email));
    navigate('/send', { state: { selectedEmails: emails } });
  };

  const handleClearFilters = () => {
    setNameFilter('');
    setClassFilter('');
    setRoleFilter('');
    setSelectedEmails(new Set());
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getDistinctClasses = (): string[] => {
    return Array.from(new Set(mailList.map(email => email.class))).sort();
  };

  const getDistinctRoles = (): string[] => {
    return Array.from(new Set(mailList.map(email => email.role))).sort();
  };

  const paginatedEmails = filteredList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Envio de Emails Next Coders
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Filtrar por nome"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Turma</InputLabel>
            <Select
              value={classFilter}
              label="Turma"
              onChange={(e: SelectChangeEvent) => setClassFilter(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {getDistinctClasses().map(cls => (
                <MenuItem key={cls} value={cls}>{cls}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Cargo</InputLabel>
            <Select
              value={roleFilter}
              label="Cargo"
              onChange={(e: SelectChangeEvent) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {getDistinctRoles().map(role => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<CleaningServicesIcon />}
            onClick={handleClearFilters}
          >
            Limpar Filtros
          </Button>

          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSendClick}
            sx={{ ml: 'auto', bgcolor: '#679d12', '&:hover': { bgcolor: '#558010' } }}
          >
            Enviar Email ({selectedEmails.size})
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedEmails.size > 0 && selectedEmails.size < paginatedEmails.length
                  }
                  checked={
                    paginatedEmails.length > 0 &&
                    selectedEmails.size === paginatedEmails.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Turma</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmails.map((email) => {
              const emailString = JSON.stringify({ name: email.name, email: email.email });
              const isSelected = selectedEmails.has(emailString);

              return (
                <TableRow
                  key={email.id}
                  hover
                  selected={isSelected}
                  onClick={() => handleSelectEmail(email)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSelected} />
                  </TableCell>
                  <TableCell>{email.email}</TableCell>
                  <TableCell>{email.name}</TableCell>
                  <TableCell>{email.role}</TableCell>
                  <TableCell>{email.class}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
};

export default CommunicationList;
