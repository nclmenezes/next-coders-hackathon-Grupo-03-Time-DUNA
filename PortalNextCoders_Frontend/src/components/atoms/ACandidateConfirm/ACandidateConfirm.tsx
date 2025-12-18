import { Dispatch, SetStateAction } from 'react';
import { Box, Button, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface ACandidateConfirmProps {
    candidateName: string;
    className: string;
    contractorName: string;
    setOpenConfirmDialog: Dispatch<SetStateAction<boolean>>;
    approveCandidate: () => void;
};

const ACandidateConfirm = ({
    candidateName,
    className,
    contractorName,
    setOpenConfirmDialog,
    approveCandidate
}: ACandidateConfirmProps) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "25px",
            gap: "10px",
            userSelect: "none"
        }}
    >
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                fontSize: "1.1em",
            }}
        >
            <WarningIcon color="warning" />
            Você confirma a aprovação?
        </Box>
        <Box>
            <Typography>Candidato: {candidateName}</Typography>
            <Typography>Turma: {className}</Typography>
            <Typography>Contratante: {contractorName}</Typography>
        </Box>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-around" }} >
            <Button variant="contained" color="success" onClick={() => approveCandidate()}>
                Sim
            </Button>
            <Button variant="contained" color="error" onClick={() => setOpenConfirmDialog(false)}>
                Não
            </Button>
        </Box>
    </Box>
);

export default ACandidateConfirm;