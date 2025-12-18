import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import { toast } from "react-hot-toast";
import { Box, Button, FormControl, Grid, TextField } from "@mui/material";
import { PageHeader } from "../Candidate/styles";
import MLoading from "../../molecules/MLoading";
import agentsService from "../../../services/Teams/agents.service";
import { UpdateAgentDto, AgentDto } from "../../../interfaces/teams/class.interfaces";
import { useAuth } from "../../../context/AuthProvider/useAuth";

function EditMaintainer() {
    const { user } = useAuth();
    const { contractorId } = useParams<string>();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { agent: AgentDto };
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [lead, setLead] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [mail, setMail] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const resp = state.agent;

            if (resp == null) {
                return showErrorToast("Não foi possível realizar a busca dos registros!");
            }

            setName(resp.name);
            setLead(resp.lead);
            setDocumentNumber(resp.documentNumber);
            setMail(resp.mail);
        } catch (error: any) {
            toast.error(error.message)
            setIsLoading(false);
        }
        setIsLoading(false);

    };

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, [contractorId]);

    const updateContractor = async () => {
        setIsLoading(true);
        
        const _data: UpdateAgentDto = {
            id: state.agent.id,
            name: name,
            lead: lead,
            documentNumber: documentNumber,
            mail: mail,
            updatedBy: user?.profileId ?? 0
        };

        const result = await agentsService.UpdateAgents(_data);
        if (result) {
            showSuccessToast('Contratante atualizado com sucesso');
            return setIsLoading(false);
        };
        setIsLoading(false);
        return showErrorToast('Erro ao atualizar Contratante');
    };

    const goBack = () => navigate(`/maintainer`);

    const handleContractorName = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const handleContractorLead = (event: ChangeEvent<HTMLInputElement>) => {
        setLead(event.target.value);
    };

    const handleContractorDocumentNumber = (event: ChangeEvent<HTMLInputElement>) => {
        setDocumentNumber(event.target.value);
    };
    
    const handleContractorMail = (event: ChangeEvent<HTMLInputElement>) => {
        setMail(event.target.value);
    };

    return (
        <Box>
            <PageHeader>
                <h1>Gestão de Mantenedores</h1>
                
            </PageHeader>

            {isLoading ? (
                <MLoading />
            ) : (
                <form autoComplete="off">
                    <FormControl fullWidth>
                        <TextField
                            id="contractor-name-label"
                            label="Nome"
                            fullWidth
                            value={name}
                            variant="outlined"
                            onChange={handleContractorName}
                            inputProps={{ maxLength: 50, autoComplete: "off" }}
                            sx={{ marginBottom: 2 }}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            label="Liderança"
                            fullWidth
                            multiline
                            value={lead}
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                            onChange={handleContractorLead}
                            inputProps={{ maxLength: 50, autoComplete: "off" }}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            value={documentNumber}
                            label="CNPJ"
                            variant="outlined"
                            onChange={handleContractorDocumentNumber}
                            inputProps={{ maxLength: 50, autoComplete: "off" }}
                            sx={{ marginBottom: 2 }}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            value={mail}
                            label="E-mail"
                            variant="outlined"
                            onChange={handleContractorMail}
                            inputProps={{ maxLength: 50, autoComplete: "off" }}
                            sx={{ marginBottom: 2 }}
                        />
                    </FormControl>
                    <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
                        <Grid item>
                            <Button
                                variant="contained"
                                sx={{ minWidth: 160, marginLeft: '3rem', marginTop: '2rem' }}
                                onClick={goBack}
                            >
                                Voltar
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                sx={{ minWidth: 160, marginTop: '2rem' }}
                                onClick={updateContractor}
                            >
                                Salvar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            )}
        </Box>
    );
}

export default EditMaintainer;
