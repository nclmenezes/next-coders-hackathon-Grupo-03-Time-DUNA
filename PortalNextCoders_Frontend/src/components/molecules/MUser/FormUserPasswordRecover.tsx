import {useState} from "react";
import {useNavigate} from "react-router";

import {Link, Box} from "@mui/material";
import Mail from '@mui/icons-material/MailOutline';

import authService from "../../../services/auth.service";
import {RecoveryPasswordInterface} from "../../../interfaces/api/account/recovery-password.interface";

import ButtonDesign from "../../atoms/Button";
import Input from "../../atoms/Input";
import {validateEmail} from "../../../utils/validators";
import {
    showLoginPasswordIncorrectToast,
    showSuccessToast
} from "../../../utils/toast";
import MLoading from "../MLoading";

export default function FormUserPasswordRecover() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [Inactive, setInactive] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(false);

    function EnableButton(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        const email = e.target?.value ?? '';
        setEmail(email);
        setInactive(email.length < 1);
    }

    async function SubmitButton(e: SubmitEvent) {
        setIsLoading(true);
        e.preventDefault();

        if (!validateEmail(email)) {
            setIsLoading(false);
            return showLoginPasswordIncorrectToast('E-mail inválido!');
        }
        
        let data: RecoveryPasswordInterface = {email: email};
        let result = await authService.recoveryPassword(data);
        if (result == null) {
            setIsLoading(false);
            return showLoginPasswordIncorrectToast('Não foi possível recuperar sua senha!');
        }

        showSuccessToast('E-mail enviado!');
        navigate('/confirm-recovery-email');
    }

    return (
        <Box component="form"
             sx={{
                 '& > :not(style)': {m: 1},
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: "center",
             }}>

            <Input
                placeholder='Digite seu e-mail'
                text='Digite seu e-mail'
                type='text'
                value={email}
                change={EnableButton}
                icon={<Mail/>}
            />

            <ButtonDesign
                isActive={Inactive}
                click={SubmitButton}
                text='Recuperar'
            />

            <Link href="/login" sx={{
                fontFamily: 'Inter', fontWeight: 500,
                color: '#0A4295', fontStyle: 'normal', textDecoration: 'none'
            }}>
                Voltar para o Login
            </Link>
            {isLoading && <MLoading/>}
        </Box>
    );
}
