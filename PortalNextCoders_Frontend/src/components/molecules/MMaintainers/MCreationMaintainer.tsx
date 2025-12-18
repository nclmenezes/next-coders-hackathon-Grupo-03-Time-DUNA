import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import MLoading from "../MLoading";
import maintainersService, { IMaintainer } from "../../../services/api/maintainers/maintainers.service";

interface IPropsMCreationMaintainer {
  isModalOpen: boolean;
  onClose: () => void;
  onFetchMaintainers: () => void;
}

export function validateCNPJ(cnpj: string): boolean {
  const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

  if (!regex.test(cnpj)) {
    return false;
  }

  cnpj = cnpj.replace(/\D/g, '');
  return true;
}

export function MCreationMaintainer({isModalOpen, onClose, onFetchMaintainers}: IPropsMCreationMaintainer){
  const [isLoading, setIsLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const [name, setName] = useState('');
  const [lead, setLead] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [mail, setMail] = useState('');

  useEffect(() => {
    if (isModalOpen) {
      setName("");
      setLead("");
      setDocumentNumber("");
      setMail("");
    }
  }, [isModalOpen]);  

  const handleName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleLead = (event: ChangeEvent<HTMLInputElement>) => {
    setLead(event.target.value);
  }; 

  const handleDocumentNumber = (event: ChangeEvent<HTMLInputElement>) => {
    setDocumentNumber(event.target.value);
  };

  const handleModalClose = () => {
    setErrorOpen(false);
  };  

  const handleMail = (event: ChangeEvent<HTMLInputElement>) => {
    setMail(event.target.value);
  };  

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!validateCNPJ(documentNumber)) {
        setErrorOpen(true);
      } else {
        const newMaintainer: IMaintainer = {
          maintainerId: 0,
          name: name,
          lead: lead,
          documentNumber: documentNumber,
          mail: mail,
          createdAt: null,
          createdBy: null,
        };
  
        await maintainersService.InsertMaintainer(newMaintainer);
        onFetchMaintainers();
        onClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <Dialog open={isModalOpen} onClose={onClose}>
      <DialogTitle>Criação de Mantenedor</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <MLoading />
        ) : (
          <form>
            <FormControl fullWidth>
              <TextField
                required
                label="Nome"
                value={name}
                variant="outlined"
                onChange={handleName}
                inputProps={{ maxLength: 50, autoComplete: 'off' }}
                margin="normal"
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                required
                label="Responsável"
                value={lead}
                variant="outlined"
                onChange={handleLead}
                inputProps={{ maxLength: 50, autoComplete: 'off' }}
                margin="normal"
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                required
                label="E-mail"
                value={mail}
                variant="outlined"
                onChange={handleMail}
                inputProps={{ maxLength: 50, autoComplete: 'off' }}
                margin="normal"
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                required
                label="CNPJ"
                value={documentNumber}
                variant="outlined"
                onChange={handleDocumentNumber}
                inputProps={{ maxLength: 50, autoComplete: 'off' }}
                margin="normal"
              />
            </FormControl>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                color="primary"
                variant="contained"
                type="button"
              >
                Cadastrar
              </Button>
            </DialogActions>
          </form>
        )}
      </DialogContent>

      <Dialog open={errorOpen} onClose={handleModalClose}>
        <DialogTitle>CNPJ errado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            O formato do CNPJ inserido é inválido.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}