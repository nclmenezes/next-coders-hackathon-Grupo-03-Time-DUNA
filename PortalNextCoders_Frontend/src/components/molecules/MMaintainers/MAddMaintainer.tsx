import { Modal, FormControl, InputLabel, Select, Box, Chip, MenuItem, Button } from "@mui/material";
import { useState } from "react";
import { IContractorMaintainer } from "../../../services/api/maintainers/maintainersContractor.service";

interface IPropsMaintainers {
  allMaintainers: IContractorMaintainer[];
  isModalOpen: boolean;
  onClose: () => void;
  onConfirm: (ids: number[]) => void;
}

export default function MAddMaintainer({ allMaintainers, isModalOpen, onClose, onConfirm }: IPropsMaintainers) {
  const [selectedMaintainerIds, setSelectedMaintainerIds] = useState<number[]>([]);

  const getMaintainerNameById = (maintainerId: number) => {
    const selectedMaintainer = allMaintainers.find(maintainer => maintainer.maintainerId === maintainerId);
    return selectedMaintainer ? selectedMaintainer.name : '';
  };

  const handleSelectedMaintainersChange = (event: any) => {
    const newSelectedMaintainerIds = event.target.value;
    setSelectedMaintainerIds(newSelectedMaintainerIds);
  };

  const handleAddMaintainers = () => {
    onConfirm(selectedMaintainerIds);
    setSelectedMaintainerIds([]);
  }

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
        width: '16rem',
        height: '26rem',
        borderRadius: '10px',
      }}>
        <h2 style={{ textAlign: 'center', margin: '2rem auto' }}>Adicionar Mantenedores</h2>
        <div>
          <InputLabel>Selecione os Mantenedores</InputLabel>
          <FormControl sx={{                  
                maxHeight: '10rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
            }}>
            <Box>
              <Select
                multiple
                sx={{
                  marginBottom: 2,
                  width: '100%',
                }}
                value={selectedMaintainerIds}
                onChange={handleSelectedMaintainersChange}
                renderValue={() => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedMaintainerIds.map((maintainerId: number) => (
                      <Chip
                        key={maintainerId}
                        label={getMaintainerNameById(maintainerId)}
                      />
                    ))}
                  </Box>
                )}
              >
                {allMaintainers.map((maintainer) => (
                  <MenuItem key={maintainer.maintainerId} value={maintainer.maintainerId}>
                    {maintainer.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </FormControl>
        </div>
        <Button
          variant="contained"
          disabled={selectedMaintainerIds.length === 0}
          onClick={handleAddMaintainers}
          style={{
            marginTop: '1rem',
            marginBottom: '2rem',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Adicionar Selecionados
        </Button>
      </div>
    </Modal>
  )
}
