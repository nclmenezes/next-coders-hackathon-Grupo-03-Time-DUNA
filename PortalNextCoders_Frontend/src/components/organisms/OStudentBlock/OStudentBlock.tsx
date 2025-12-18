import React, {useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MLoading from "../../molecules/MLoading";
import studentService from "../../../services/student/student.service";
import {showErrorToast, showSuccessToast} from "../../../utils/toast";

interface BlockStudentModalProps {
    open: boolean;
    onClose: () => void;
    studentId: number;
    studentName: string;
}

export function OStudentBlock({open, onClose, studentId, studentName}: BlockStudentModalProps) {
    const [loading, setLoading] = useState(false)

    const handleOpenConfirmDialog = async () => {
        setLoading(true);
        const response = await studentService.BlockStudent(studentId);
        if (response === 204) {
            setLoading(false);
            onClose();
            showSuccessToast("Mátricula trancada com sucesso!");
        } else {
            setLoading(false);
            onClose();
            showErrorToast("Erro ao trancar a mátricula!");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Deseja trancar a mátricula deste aluno?</DialogTitle>
            {loading ? <MLoading/> : (
                <DialogContent>
                    <p>Após trancar a mátricula, o aluno não poderá mais acessar o sistema.</p>
                    <p>Tem certeza que deseja trancar a mátricula do aluno {studentName} ?</p>
                    <p><strong>Esta ação não poderá ser desfeita sem a intervenção técnica.</strong></p>
                </DialogContent>
            )}

            <DialogActions>
                <Button onClick={handleOpenConfirmDialog} color="primary">
                    Trancar
                </Button>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
