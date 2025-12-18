import {useNavigate} from "react-router";
import {useState} from "react";
import {dismissToast, showErrorToast, showInfoToast, showLoadingToast, showSuccessToast} from "../../../../utils/toast";
import contractorService from "../../../../services/Teams/contractor.service";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import ConfirmationDialog from "../../../atoms/ConfirmationDialog";
import MoveClassDialog from "./MoveClassDialog.ts";
import {SimpleDialogProps} from "../interfaces/SimpleDialogProps";

const ClassesDialog = (props: SimpleDialogProps) => {
    const navigate = useNavigate();
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const { onClose, selectedValue, open, studentClassId } = props;
    const [openClassMoveDialog, setOpenClassMoveDialog] = useState(false);
    const handleOpenClassMoveDialog = () => {
        setOpenClassMoveDialog(true);
    };
    const handleCloseClassMoveDialog = (value?: string) => {
        setOpenClassMoveDialog(false);
    }
    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleConfirmDialog = () => {
        setConfirmationOpen(true);
    };

    const deactivateStudentClass = async () => {
        const toastId = showLoadingToast("Excluindo turma...", {
            position: "top-center",
        });

        try {
            await contractorService.deactivateStudentClass(Number(studentClassId));
            showSuccessToast("Turma excluida", {duration: 2000})
            navigate("/teams");
        } catch (error: any) {
            if (error.response.data.errors.messages[0] === "Turma possui alunos.") {
                showInfoToast("Turma possui alunos escolha uma nova turma para eles:", {
                    duration: 5000,
                });
                handleOpenClassMoveDialog();
            }

            if (error.response.data.errors.messages[0] === "Turma já iniciada.") {
                showErrorToast("Não é possível excluir uma turma já iniciada.", {
                    duration: 5000,
                });
                navigate(`/teams/management/${studentClassId}`);
                setConfirmationOpen(false);
                handleClose();
            }
        }
        setConfirmationOpen(false);
        dismissToast(toastId);
    };

    return (
        <Dialog onClose={handleClose} open={open} maxWidth="sm">
            <ConfirmationDialog
                open={confirmationOpen}
                onClose={() => setConfirmationOpen(false)}
                onConfirm={deactivateStudentClass}
                message={"Você tem certeza que deseja excluir essa turma??"} />
            <DialogTitle>Excluir Turma</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
                <MoveClassDialog
                    open={openClassMoveDialog}
                    onClose={handleCloseClassMoveDialog}
                    studentClassId={studentClassId}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleConfirmDialog} variant="contained" color="primary">
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ClassesDialog;