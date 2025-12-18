import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';

import { Box } from '@mui/material';
import Mail from '@mui/icons-material/MailOutline';
import Padlock from '@mui/icons-material/LockOutlined';

import ButtonDesign from '../atoms/Button';
import Input from '../atoms/Input';

import loginService from '../../services/login.service';
import { LoginInterface } from '../../interfaces/login.interface';

import { dismissToast, showErrorToast, showLoadingToast } from '../../utils/toast';

export default function FormLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Inactive, setInactive] = useState<boolean>(true);

  function emailOk(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const email = e.target?.value ?? '';
    setEmail(email)
    setInactive(email.length === 0 || password.length === 0)
  }

  function passwordOk(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const password = e.target?.value ?? '';
    setPassword(password)
    setInactive(email.length === 0 || password.length === 0)
  }

  async function SubmitButton(event: FormEvent) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert('Email e Senha são obrigatórios');
      return;
    }

    const toastId = showLoadingToast('Logando...');
    var data: LoginInterface = { email: email, password: password };

    var result = await loginService.Login(data);
    dismissToast(toastId);
    if (result == null) {
      return showErrorToast('Usuário ou Senha incorretos!');
    }
    navigate("/");
  };

  return (
    <Box component="form"
      sx={{
        '& > :not(style)': { m: 1 },
        display: 'flex',
        flexDirection: 'column',
      }}>

      <Input
        placeholder='Digite seu e-mail'
        text='Digite seu e-mail'
        type='text'
        value={email}
        change={emailOk}
        icon={<Mail />}
      />

      <Input
        placeholder='Digite sua senha'
        text='Digite sua senha'
        type='password'
        value={password}
        change={passwordOk}
        icon={<Padlock />}
      />

      <ButtonDesign
        isActive={Inactive}
        click={SubmitButton}
        text='Login'
      />
    </Box>
  );
}

