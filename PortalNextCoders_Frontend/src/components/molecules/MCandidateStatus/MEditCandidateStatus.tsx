import { useState } from "react";
import Swal from 'sweetalert2';
import candidateService from "../../../services/api/student/candidateStatus.service"
import { Box, Button, Grid, MenuItem, Modal, Select } from "@mui/material";
import MLoading from "../MLoading";

interface EditCandidateStatus {
  candidateId: number;
  currentCandidateStatusId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function MEditCandidateStatus({candidateId, currentCandidateStatusId, isOpen, onClose}: EditCandidateStatus){
  const [candidateStatus, setCandidateStatus] = useState<number>(currentCandidateStatusId);
  const [isSaving, setIsSaving] = useState(false);
  const selectCandidateStatus = [
    {id: 6, status: 'Entrevista Selecionado'},
    {id: 7, status: 'Entrevista Agendada'},
    {id: 8, status: 'Entrevista Realizada'},
    {id: 9, status: 'Candidato Em Espera'},
    {id: 10, status: 'Candidato Aprovado'},
    {id: 11, status: 'Candidato Não Aprovado'},
    {id: 12, status: 'Matrícula Documentação'},
    {id: 13, status: 'Matrícula Assinatura Contrato'},
    {id: 14, status: 'Matrícula Abertura Conta'},
    {id: 15, status: 'Matriculado'},
  ]

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await candidateService.UpdateStatus(candidateId, candidateStatus);
      setIsSaving(false);
      onClose();
  
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Status atualizado com sucesso!',
      });
    } catch (error) {
      setIsSaving(false);
  
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro ao atualizar o status.',
      });
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2 style={{ marginBottom: "16px" }}>Editar Status do candidato</h2>
        {isSaving ? ( 
          <MLoading />
        ) : (
          <form>
            <Select
              value={candidateStatus}
              label="Age"
              sx={{ display: 'block', margin: '2rem auto' }}              
              onChange={(e)=> setCandidateStatus(Number(e.target.value))}
            >
              {selectCandidateStatus.map((status) => (
                <MenuItem value={status.id}>{status.status}</MenuItem>
              ))}
            </Select>            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button variant="contained" onClick={onClose} fullWidth>
                  Cancelar
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Salvar
                </Button>
              </Grid>
            </Grid>            
          </form>
        )}        
      </Box>
    </Modal>
  )
}