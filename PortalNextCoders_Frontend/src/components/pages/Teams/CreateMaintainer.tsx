import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { showErrorToast } from "../../../utils/toast";
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    TextField
} from "@mui/material";
import {PageHeader} from "../Candidate/styles";
import MLoading from "../../molecules/MLoading";
import agentsService from "../../../services/Teams/agents.service";
import { AgentTypes, CreateAgentDto } from "../../../interfaces/teams/class.interfaces";
import { useAuth } from "../../../context/AuthProvider/useAuth";

function CreateMaintainer() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [lead, setLead] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [mail, setMail] = useState("");

    const create = async () => {
        setIsLoading(true);
 
        const _data: CreateAgentDto = {
            agentTypeId: AgentTypes.Maintainer,
            name: name,
            lead: lead,
            documentNumber: documentNumber,
            mail: mail,
            createdBy: user?.profileId ?? 0
        }


        try {
            const result = await agentsService.CreateAgents(_data);
            if (!result) {
                showErrorToast('Erro ao criar Contratante');
            }
            setIsLoading(false)
        } catch (error: any) {
            showErrorToast(error.response.data.errors.messages[0]);
            setIsLoading(false);
        }
    };

    const goBack = () => {
        navigate(`/maintainer`);
    };

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
                <h1>Criação de Mantenedores</h1>
            </PageHeader>

            {isLoading ? (
                <MLoading/>
            ) : (
                <>
                    <Box component="form"
                        sx={{
                            '& > :not(style)': {m: 1},
                            display: 'flex',
                            flexDirection: 'column',
                            maxWidth: '600px',
                            margin: '0 auto',
                        }}
                        noValidate
                        autoComplete="off">
                        <Grid container direction="column" rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        required
                                        id="contractor-name-label"
                                        label={"Nome"}
                                        value={name}
                                        variant="outlined"
                                        onChange={handleContractorName}
                                        inputProps={{maxLength: 50, autoComplete: "off"}}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="contracotr-lead-label"/>
                                    <TextField
                                        required
                                        label="Responsável"
                                        value={lead}
                                        variant="outlined"
                                        onChange={handleContractorLead}
                                        inputProps={{maxLength: 50, autoComplete: "off"}}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="contracotr-lead-label"/>
                                    <TextField
                                        required
                                        label="email"
                                        value={mail}
                                        variant="outlined"
                                        onChange={handleContractorMail}
                                        inputProps={{maxLength: 50, autoComplete: "off"}}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="contractor-document-label"/>
                                    <TextField
                                        required
                                        label="Cnpj"
                                        value={documentNumber}
                                        variant="outlined"
                                        onChange={handleContractorDocumentNumber}
                                        inputProps={{maxLength: 50, autoComplete: "off"}}
                                    />
                                </FormControl>
                            </Grid>                                                
                        </Grid>
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
                                    onClick={create}
                                >
                                    Salvar
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}
        </Box>
    );
}

export default CreateMaintainer;