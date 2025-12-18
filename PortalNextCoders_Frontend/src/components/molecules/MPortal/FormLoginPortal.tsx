import {FormEvent, useState} from "react";
import {useNavigate} from "react-router";

import {Box, Link} from "@mui/material";
import Mail from "@mui/icons-material/MailOutline";
import Padlock from "@mui/icons-material/LockOutlined";

import Input from "../../atoms/Input";
import ButtonDesign from "../../atoms/Button";
import {
    showLoginPasswordIncorrectToast,
} from "../../../utils/toast";
import {useAuth} from "../../../context/AuthProvider/useAuth";
import MLoading from "../MLoading";


export default function FormLoginPortal() {
    const navigate = useNavigate();
    const {signIn} = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [Inactive, setInactive] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);


    function emailOk(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        const email = e.target?.value ?? "";
        setEmail(email);
        setInactive(email.length === 0 || password.length === 0);
    }

    function passwordOk(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        const password = e.target?.value ?? "";
        setPassword(password);
        setInactive(email.length === 0 || password.length === 0);
    }

    async function SubmitButton(event: FormEvent) {
        setIsLoading(true);
        event.preventDefault();
        if (!email.trim() || !password.trim()) {
            alert("Email e Senha são obrigatórios");
            return;
        }

        const result = await signIn(email, password);

        if (result == null) {
            setIsLoading(false)
            return showLoginPasswordIncorrectToast("Usuário ou Senha incorretos!", {duration: 500});
        }

        navigate("/");
    }

    const handleForgotPassword = () => {
        navigate("/recover");
    }

    return (
        <Box
            component="form"
            sx={{
                "& > :not(style)": {m: 1},
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Input
                placeholder="Digite seu e-mail"
                text="Digite seu e-mail"
                type="text"
                value={email}
                change={emailOk}
                icon={<Mail/>}
            />

            <Input
                placeholder="Digite sua senha"
                text="Digite sua senha"
                type="password"
                value={password}
                change={passwordOk}
                icon={<Padlock/>}
            />

            <Link
                component="a"
                variant="button"
                onClick={handleForgotPassword}
                type="button"
                underline={"none"}
                sx={{color: "#0A4295", fontFamily: "Inter", fontWeight: 500, cursor: 'pointer'}}
            >
                Esqueci minha senha
            </Link>

            <ButtonDesign isActive={Inactive} click={SubmitButton} text="Login"/>
            {isLoading && <MLoading/>}
        </Box>
    );
}
