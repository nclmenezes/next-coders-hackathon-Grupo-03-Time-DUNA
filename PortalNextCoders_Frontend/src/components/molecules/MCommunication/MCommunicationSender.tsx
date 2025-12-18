import {Chip, TextField, Button} from "@mui/material";
import {Box} from "@mui/system";
import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import {useNavigate} from "react-router";
import SendIcon from "@mui/icons-material/Send";
import MailService from "../../../services/api/Email/mail.service";
import MLoading from "../MLoading";
import {
    dismissToast,
    showLoadingToast,
    showNotFoundErrorToast,
    showSuccessToast
} from "../../../utils/toast";
import {PageHeader} from "../../pages/Candidate/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Payload {
    name: string;
    to: string;
    type: number;
    token?: string;
    message: string;
}

interface Email {
    name: string;
    email: string;
}

export function MCommunicationSender() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { selectedEmails: Email[] } | undefined;
    const selectedEmails = state?.selectedEmails || [];
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSendEmail = async () => {
        setIsLoading(true);
        const payload: Payload = {
            name: selectedEmails.map(email => email.name).join("; "),
            to: selectedEmails.map(email => email.email).join("; "),
            type: 12,
            message: message,
        };
        const toastId = showLoadingToast('Enviando...');

        const result = await MailService.sendCommunication(payload);
        dismissToast(toastId);
        if (result == null || result !== 200) {
            setIsLoading(false);
            return showNotFoundErrorToast('Erro ao enviar email!');
        }
        setIsLoading(false);
        showSuccessToast('Email enviado com sucesso!');
        navigate("/communication");
    };

    const handleBack = () => {
        navigate("/communication");
    }

    return (<>
        <PageHeader>
            <h1>Envio de emails Next Coders</h1>
        </PageHeader>
        {
            isLoading ? (<MLoading/>) : (
                <Box>
                    <Box>
                        <Box
                            sx={{
                                border: '1px solid',
                                borderColor: 'grey.500',
                                width: '50%',
                                margin: '0 auto',
                                padding: 2,
                            }}
                        >
                            {selectedEmails.map((email: Email, index: number) => (
                                <Chip key={index} label={email.email}
                                      sx={{
                                          backgroundColor: 'primary.main', // Change to your desired color
                                          color: 'white', // Change to your desired text color
                                      }}
                                />
                            ))}

                        </Box>
                        <Box
                            sx={{
                                border: '1px solid',
                                borderColor: 'grey.500',
                                width: '50%',
                                margin: '0 auto',
                                padding: 2,
                            }}
                        >
                            <TextField
                                id="filled-multiline-static"
                                label="Messagem"
                                multiline
                                rows={4}
                                defaultValue="Default Value"
                                variant="filled"
                                sx={{

                                    width: '100%',
                                    height: '200px',
                                    '& .MuiInputBase-root': {
                                        height: '100%',
                                    },
                                }}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: 2,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{minWidth: 100, bgcolor: "#e38d23", padding: '10px'}}
                                    startIcon={<ArrowBackIcon/>}
                                    color={"error"}
                                    onClick={handleBack}
                                >
                                    Voltar
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{minWidth: 100, bgcolor: "#679d12", padding: '10px'}}
                                    onClick={handleSendEmail}
                                    startIcon={<SendIcon/>}
                                >
                                    Enviar Email
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>)
        }
    </>);
}