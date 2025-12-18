import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import ManagementClassesService from '../../../services/Teams/classes/managementClasses.service';
import AgentClassesService from '../../../services/Teams/classes/agentClasses.service';
import { IManagementClass, IAgentClass } from "../../../interfaces/teams/class.interfaces";
import { showErrorToast } from '../../../utils/toast';
import { ICandidateApproveRequest } from "../../../interfaces/candidate/candidateApprove.interfaces";
import CadidateApprovalService from '../../../services/Candidate/cadidateApproval.service';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import MLoading from '../MLoading';
import ACandidateConfirm from '../../atoms/ACandidateConfirm/ACandidateConfirm';
import { showSuccessToast } from '../../../utils/toast';

interface CandidateClassProps {
    profileId: number;
    studentId: number;
    studentName: string;
    studentEmail: string;
    setCandidateConfirm: Dispatch<SetStateAction<boolean>>;
};

const MCandidateClass = ({
    profileId, studentId, studentName, studentEmail, setCandidateConfirm
}: CandidateClassProps) => {
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [managementClasses, setManagamentClasses] = useState<IManagementClass[]>([]);
    const [agentClasses, setAgentClasses] = useState<IAgentClass[] | null>(null);
    const [selectManagementClass, setSelectManagementClass] = useState<IManagementClass | null>(null);
    const [selectAgentClass, setSelectedAgentClass] = useState<IAgentClass | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);

    const fetchManagementData = async () => {
        // setting the request page size to 100 because there is no endpoint to fetch the total list
        setPageLoading(true);
        const managementClassResponse = await ManagementClassesService.GetManagementClasses(1, 100, null);
        setPageLoading(false);
        if (!managementClassResponse) return showErrorToast('Um erro ocorreu ao tentar obter a listagem de turmas mães!');
        setManagamentClasses(managementClassResponse.data);
    };

    const fetchAgentClass = async () => {
        // setting the request page size to 100 because there is no endpoint to fetch the total list
        setPageLoading(true);
        const agentClassResponse = await AgentClassesService.GetAgentClasses(1, 100, { studentClassManagementId: selectManagementClass!.id });
        setPageLoading(false);
        if (!agentClassResponse) return showErrorToast('Um erro ocorreu ao tentar obter a listagem de turmas filhas!');
        setAgentClasses(agentClassResponse.data);
    };

    const approveCandidate = async () => {
        if (!selectManagementClass || !selectAgentClass) return;
        const approveRequest = {
            profileId,
            studentId,
            contractorId: selectManagementClass.contractor.id,
            studentClassReferenceId: selectAgentClass.studentClassReferenceId,
            studentEmail,
            approveWithoutTest: false
        } as ICandidateApproveRequest;
        setPageLoading(true);
        const candidateApproveResponse = await CadidateApprovalService.ApproveCandidate(approveRequest);
        setPageLoading(false);
        if (!candidateApproveResponse) {
            setOpenConfirmDialog(false);
            return showErrorToast('Um erro ocorreu ao tentar aprovar o estudante!')
        };
        setOpenConfirmDialog(false);
        setCandidateConfirm(false);
        showSuccessToast('Candidato aprovado com sucesso!');
    };

    useEffect(() => {
        if (!selectManagementClass) return;
        fetchAgentClass();
    }, [selectManagementClass]);
    
    useEffect(() => {
        fetchManagementData();
    }, []);

    const resetManagementClass = () => {
        setAgentClasses(null);
        setSelectManagementClass(null);
        setSelectedAgentClass(null);
    };

    const handleSelectManagementClass = (selectedValue: IManagementClass | null) => {
        if (!selectedValue) return resetManagementClass();
        setSelectManagementClass(selectedValue);
    };

    return (
        <>
            { pageLoading && <MLoading /> }
            { 
                openConfirmDialog &&
                <ACandidateConfirm
                    candidateName={studentName}
                    className={selectAgentClass!.name}
                    contractorName={selectManagementClass!.contractor.name}
                    setOpenConfirmDialog={setOpenConfirmDialog}
                    approveCandidate={approveCandidate}
                />
            }
            <Box
                sx={{
                    display: openConfirmDialog ? "none" : "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "25px",
                    gap: "25px",
                    userSelect: "none"
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.1em" }}>
                    <PrivacyTipIcon color="warning" />
                    Selecione a classe na qual o candidato será matriculado
                </Box>
                <Autocomplete
                    
                    options={managementClasses!}
                    getOptionLabel={(option) => option.name}
                    sx={{ width: "80%" }}
                    renderInput={(params) => <TextField {...params} label="Turma mãe" />}
                    value={selectManagementClass}
                    onChange={(_, selectedValue: IManagementClass | null) =>
                        handleSelectManagementClass(selectedValue)
                    }
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    noOptionsText="Nenhuma turma mãe disponível"
                />
                {
                    agentClasses != null &&
                    <Autocomplete
                        options={agentClasses!}
                        getOptionLabel={(option) => option.name}
                        sx={{ width: "80%" }}
                        renderInput={(params) => <TextField {...params} label="Turma filha" />}
                        value={selectAgentClass}
                        onChange={(_, selectedValue: IAgentClass | null) =>
                            setSelectedAgentClass(selectedValue)
                        }
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        noOptionsText="Nenhuma turma filha disponível"
                    />
                }
                {
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-around" }} >
                        <Button
                            variant="contained"
                            color={selectAgentClass ? "success" : "inherit"}
                            sx={{ cursor: selectAgentClass ? "pointer" : "not-allowed" }}
                            onClick={() => {
                                if (!selectAgentClass) return;
                                setOpenConfirmDialog(true);
                            }}
                        >
                            Confirmar
                        </Button>
                        <Button variant="contained" color="error" onClick={() => setCandidateConfirm(false)}>
                            Cancelar
                        </Button>
                    </Box>
                }
            </Box>
        </>
    );
};

export default MCandidateClass;