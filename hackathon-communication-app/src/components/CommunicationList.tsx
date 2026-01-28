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
  InputBase,
  Toolbar,
  AppBar,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import { useNavigate } from 'react-router-dom';
import { Email } from '../types';
import mailService from '../services/mailService';
import Loading from './Loading';
import { showNotFoundErrorToast } from '../utils/toast';
import logo from '../utils/logo.png'
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));



const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

  interface CommunicationListProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

  const CommunicationList: React.FC<CommunicationListProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [mailList, setMailList] = useState<Email[]>([]);
  const [filteredList, setFilteredList] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  
  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [newEmailData, setNewEmailData] = useState({
    name: '',
    email: '',
    class: '',
    role: ''
  });

  // Options for selects
  const classesOptions = ['Turma A', 'Turma B', 'Turma C', 'Instrutor(a)', 'Administração'];
  const rolesOptions = ['Aluno', 'Diretor', 'Coordenador' , 'Instrutor'];

  // 2. Lógica de busca com Debounce
useEffect(() => {
  const delayDebounceFn = setTimeout(async () => {
    if (searchTerm.trim() !== '') {
      setIsLoading(true);
      try {
        const results = await mailService.searchEmails(searchTerm);
        setMailList(results); // Atualiza a lista principal com os resultados da busca
      } catch (error) {
        showNotFoundErrorToast('Erro ao realizar busca');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Se a busca for apagada, recarrega a lista completa
      loadEmails();
    }
  }, 500); // Aguarda 500ms após o último caractere digitado

  return () => clearTimeout(delayDebounceFn);
}, [searchTerm]);

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

  const handleSaveEmail = async () => {
  setIsLoading(true);
  try {
    if (editingId) {
      // Se tem ID, chama UPDATE
      await mailService.updateEmail(editingId, newEmailData);
    } else {
      // Se não tem ID, chama ADD (Create)
      await mailService.addEmail(newEmailData);
    }
    
    setOpenModal(false);
    setEditingId(null); // Limpa o estado de edição
    setNewEmailData({ name: '', email: '', class: '', role: '' });
    await loadEmails();
  } catch (error) {
    showNotFoundErrorToast("Erro ao salvar dados");
  } finally {
    setIsLoading(false);
  }
};

// Função para Deletar
const handleDelete = async (id: string) => {
  if (window.confirm("Tem certeza que deseja excluir este cadastro?")) {
    try {
      await mailService.deleteEmail(id);
      await loadEmails(); // Recarrega a tabela
    } catch (error) {
      showNotFoundErrorToast("Erro ao excluir cadastro");
    }
  }
};

// Função para Abrir Edição
const [editingId, setEditingId] = useState<string | null>(null);

const handleEditClick = (email: Email) => {
  setNewEmailData({
    name: email.name,
    email: email.email,
    class: email.class,
    role: email.role
  });
  setEditingId(email.id); // Guardamos o ID para saber que é uma edição
  setOpenModal(true);
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
      
    <AppBar position="static" sx={{ 
    // Fundo: Branco no Light, padrão (paper) no Dark
    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'white',
    
    // Texto/Ícones: Cinza (padrão) no Dark, Preto no Light
    color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : 'black', 
    
    boxShadow: 'none',
    backgroundImage: 'none', // Remove o brilho/elevação cinza do Dark Mode
    borderBottom: (theme) => theme.palette.mode === 'light' ? '1px solid #e0e0e0' : 'none' 
  }}>
        <Toolbar>
        

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            <img src= {logo} width={180}/>
          </Typography>
          <Search sx={{ marginRight: 2 }}>
            <SearchIconWrapper sx={{ color: 'grey' }}>
              <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Buscar..."
        inputProps={{ 'aria-label': 'search' }}
        sx={{ color: 'black' }}
        // Conexão com o estado
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </Search>

          <Button 
  onClick={() => setDarkMode(!darkMode)}
  variant="contained"
  startIcon={darkMode ? <Brightness7Icon /> : <Brightness4Icon/>}
  sx={{ ml: 'auto', bgcolor: '#679d12', 
    '&:hover': { bgcolor: '#558010' },
    color: 'white',
    textTransform: 'none' // Evita que o texto fique todo em maiúsculo (opcional)
  }}
>
  {darkMode ? 'Light' : 'Dark'}
</Button>

{/* Botão para abrir o modal - Adicione perto do botão de Enviar */}
<Button
  variant="contained"
  color="secondary"
  onClick={() => setOpenModal(true)}
  sx={{ ml: 2, bgcolor: '#125E97' }}
>
  Cadastrar Novo E-Mail
</Button>

{/* Modal de Cadastro */}
<Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
  <DialogTitle sx={{ fontWeight: 'bold', color: '#125E97' }}>Cadastrar Novo E-mail</DialogTitle>
  <DialogContent>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
      <TextField
        label="Nome Completo"
        fullWidth
        value={newEmailData.name}
        onChange={(e) => setNewEmailData({...newEmailData, name: e.target.value})}
      />
      <TextField
        label="E-mail"
        type="email"
        fullWidth
        value={newEmailData.email}
        onChange={(e) => setNewEmailData({...newEmailData, email: e.target.value})}
      />
      
      <FormControl fullWidth>
        <InputLabel>Turma</InputLabel>
        <Select
          value={newEmailData.class}
          label="Turma"
          onChange={(e) => setNewEmailData({...newEmailData, class: e.target.value})}
        >
          {classesOptions.map(cls => <MenuItem key={cls} value={cls}>{cls}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Cargo</InputLabel>
        <Select
          value={newEmailData.role}
          label="Cargo"
          onChange={(e) => setNewEmailData({...newEmailData, role: e.target.value})}
        >
          {rolesOptions.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  </DialogContent>
  <DialogActions sx={{ p: 3 }}>
    <Button onClick={() => setOpenModal(false)} color="inherit">Cancelar</Button>
    <Button 
    onClick={handleSaveEmail} 
    variant="contained" 
    disabled={!newEmailData.email || !newEmailData.name}
    sx={{ bgcolor: '#679d12', '&:hover': { bgcolor: '#558010' } }}
  >
    {editingId ? 'Salvar Alterações' : 'Confirmar Cadastro'}
  </Button>
  </DialogActions>
</Dialog>

      </Toolbar>
      </AppBar>
    </Box>
      <Box sx={{ mb: 4 }}>

        
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontFamily: 'Oxanium, serif', fontSize: '4 rem', fontWeight: 'bold', color: '#125E97' }}>
          Caixa de Mensagens Next Coders
        </Typography>
        

      <Typography variant="body2" color="text.secondary">
         Envie avisos, comunicados e mensagens importantes para alunos e instrutores
      </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
         

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
            sx={{color: '#125E97', borderColor: '#125E97', '&:hover': { borderColor: '#1874bb' } }}
          >
            Limpar Filtros
          </Button>

          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            onClick={() => navigate('/sent-emails')}
            sx={{color: '#125E97', borderColor: '#125E97', '&:hover': { borderColor: '#1874bb' } }}
          >
            Histórico de E-mails Enviados
          </Button>

          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSendClick}
            sx={{ ml: 'auto', bgcolor: '#679d12', '&:hover': { bgcolor: '#558010' } }}
          >
            Enviar Novo Email ({selectedEmails.size})
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
              <TableCell></TableCell>
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
                  <TableCell align="right">
  <Button onClick={(e) => { e.stopPropagation(); handleEditClick(email); }}>
   <EditIcon sx={{ width: 20, height: 20 }} />
  </Button>
  <Button color="error" onClick={(e) => { e.stopPropagation(); handleDelete(email.id); }}>
    <DeleteIcon sx={{ width: 20, height: 20 }} />
  </Button>
</TableCell>
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
