import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent
} from "@mui/material";
import studentService from "../../../../services/student/student.service";
import {dismissToast, showErrorToast, showLoadingToast, showSuccessToast} from "../../../../utils/toast";
import contractorService from "../../../../services/Teams/contractor.service";
import ConfirmationDialog from "../../../atoms/ConfirmationDialog";
import {MoveDialogProps} from "../interfaces/MoveDialogProps";

const MoveClassDialog = (props: MoveDialogProps) => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState<any[]>([]);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const { onClose, selectedValue, open, studentClassId } = props;
    const [classesId, setClassesId] = useState(0);

    const handleFilterClasses = (event: SelectChangeEvent) => {
        const selectedValue = event.target.value;
        if (selectedValue != undefined) {
            setClassesId(parseInt(selectedValue));
        }
    };
    useEffect(() => {
        getActiveClasses();
    }, []);

    const getActiveClasses = async () => {
        const response = await studentService.getActiveClassesByContractorCoverageId(
            1
        );
        setClasses(response);
    };
    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleConfirmDialog = () => {
        setConfirmationOpen(true);
    };

    const deactivateStudentClass = async () => {
        const toastId = showLoadingToast("Movendo turma...", {
            position: "top-center",
        });

        try {
            await contractorService.moveStudents(Number(studentClassId), classesId);
            showSuccessToast("Alunos Movidos de turma", {duration: 2000})
            handleClose();
        } catch (error: any) {
            showErrorToast(error.response.data.errors.messages[0] ?? "Erro ao mover aluno de turma", {duration: 2000})
            navigate(`/teams/management/${studentClassId}`);
            setConfirmationOpen(false);
            handleClose();
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
                message={"Você tem certeza que deseja mover os alunos desta turma??"} />
            <DialogTitle>Desativar Turma</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
                <FormControl fullWidth sx={{ mt: 3 }}>
                    <InputLabel id="class-select-label">Turma</InputLabel>
                    <Select
                        labelId="class-select-label"
                        label="Turma"
                        key={classesId}
                        value={classesId.toString()}
                        onChange={handleFilterClasses}
                    >
                        <MenuItem value="0">- SELECIONE -</MenuItem>
                        {classes.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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

export default MoveClassDialog;