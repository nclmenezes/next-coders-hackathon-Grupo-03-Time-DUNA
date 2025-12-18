import { Button, IconButton, List, ListItem
  , ListItemSecondaryAction, ListItemText, Modal } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { IContractorMaintainer } from "../../../services/api/maintainers/maintainersContractor.service";

interface IPropsMaintainers {
  maintainers: IContractorMaintainer[];
  isModalOpen: boolean;
  onClose: () => void;
  onConfirm: (maintainer: IContractorMaintainer) => void;
  onOpenAddMaintainer: () => void;
}

export default function MListMaintainers({maintainers, isModalOpen
  , onClose, onConfirm, onOpenAddMaintainer}: IPropsMaintainers){
  return (
    <Modal open={isModalOpen} onClose={onClose}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '16px',
        width: '20rem',
        height: '20rem',
        borderRadius: '10px',
      }}>
        <div>
          <h2 style={{ textAlign: 'center' }}>Mantenedores</h2>
          <List style={{ maxHeight: '10rem', overflow: 'auto' }}>
            {maintainers.map((maintainer) => (
              <ListItem key={maintainer.maintainerId}>
                <ListItemText primary={maintainer.name} />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    aria-label="delete" 
                    onClick={() => onConfirm(maintainer)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <Button variant="contained" onClick={onOpenAddMaintainer}>
            Adicionar
          </Button>
        </div>
      </div>
    </Modal>    
  )
}