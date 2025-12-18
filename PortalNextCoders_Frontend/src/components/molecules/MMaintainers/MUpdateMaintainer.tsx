import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  Modal,
  TextField,
} from "@mui/material";
import { useState } from "react";
import MLoading from "../../molecules/MLoading";
import maintainersService, { IMaintainer } from "../../../services/api/maintainers/maintainers.service";

interface IUpdateMaintainer {
  maintainer: IMaintainer;
  isModalOpen: boolean;
  onClose: () => void;
  onFetchMaintainers: () => void;
}

function validateCNPJ(cnpj: string): boolean {
  const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

  if (!regex.test(cnpj)) {
    return false;
  }

  cnpj = cnpj.replace(/\D/g, '');
  return true;
}

export default function MUpdateMaintainer({ maintainer, isModalOpen
  , onClose, onFetchMaintainers }: IUpdateMaintainer) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [editedMaintainer, setEditedMaintainer] = useState<IMaintainer>(maintainer);

  const handleFieldChange = (field: keyof IMaintainer, value: string) => {
    setEditedMaintainer((prevMaintainer) => ({
      ...prevMaintainer,
      [field]: value,
    }));
  }

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      if (!validateCNPJ(editedMaintainer.documentNumber)) {
        setErrorOpen(true);
      }else{
        await maintainersService.Update(editedMaintainer);
        onFetchMaintainers();
        onClose();
      }      
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleModalClose = () => {
    setErrorOpen(false);
  };    

  return (
    <Dialog open={isModalOpen} onClose={onClose}>
      <DialogTitle>Atualizando o mantenedor</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <MLoading />
        ) : (
          <form>
            <FormControl fullWidth>
              <TextField
                label="Nome"
                value={editedMaintainer.name}
                variant="outlined"
                onChange={(e) => handleFieldChange("name", e.target.value)}
                inputProps={{ maxLength: 50, autoComplete: 'off' }}
                margin="normal"
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Responsável"
                value={editedMaintainer.lead}
                variant="outlined"
                onChange={(e) => handleFieldChange("lead", e.target.value)}
                inputProps={{ maxLength: 50, autoComplete: 'off' }}
                margin="normal"
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="CNPJ"
                value={editedMaintainer.documentNumber}
                variant="outlined"
                onChange={(e) => handleFieldChange("documentNumber", e.target.value)}
                inputProps={{ maxLength: 50, autoComplete: 'off' }}
                margin="normal"
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="E-mail"
                value={editedMaintainer.mail}
                variant="outlined"
                onChange={(e) => handleFieldChange("mail", e.target.value)}
                inputProps={{ maxLength: 50, autoComplete: 'off' }}
                margin="normal"
              />
            </FormControl>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={handleUpdate}
                color="primary"
                variant="contained"
                type="button"
              >
                Atualizar
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
  );
}
