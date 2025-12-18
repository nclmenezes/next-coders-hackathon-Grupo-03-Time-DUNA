import { FormEvent, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";

import ButtonDesign from '../../atoms/Button';
import Input from '../../atoms/Input';

import { Box,  Typography } from '@mui/material';

import Padlock from '@mui/icons-material/LockOutlined';
import Check from '@mui/icons-material/CheckCircle';

import { ResetPasswordInterface } from '../../../interfaces/api/account/reset-passord.interface';
import LoginService from "../../../services/login.service";
import {
  showLoginPasswordIncorrectToast,
  showSuccessToast
} from '../../../utils/toast';
import MLoading from "../MLoading";

export default function FormUserResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [Inactive, setInactive] = useState<boolean>(true);
  const location = useLocation();
  const urlEmail = location.pathname.split("/")[2];
  const urlToken = location.pathname.split("/")[3];
  const [isLoading, setIsLoading] = useState(false);

  function onPasswordChange(e: any) {
    let passwordChanged = e.target.value
    setPassword(passwordChanged)
    setInactive(!comparePasswords(passwordChanged, confirmPassword))
  }

  function onConfirmPasswordChange(e: any) {
    let confirmPasswordChanged = e.target.value
    setConfirmPassword(confirmPasswordChanged)
    setInactive(!comparePasswords(password, confirmPasswordChanged))
  }

  function comparePasswords(password: string, confirmPassword: string) {
    if (!checkPassword(password)) return false;
    return password === confirmPassword
  }

  function checkPassword(pass: string) {
    let r = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$*&@#])[0-9a-zA-Z$*&@#.]{8,}$/;
    return r.test(pass);
  }

  function isValidFields() {
    if (!password.trim()) return false;
    if (!confirmPassword.trim()) return false;
    if (!urlEmail.trim()) return false;
    return true;
  }

  async function SubmitButton(event: FormEvent) {
    setIsLoading(true);
    event.preventDefault();
    if (!isValidFields()) {
      setIsLoading(false);
      return showLoginPasswordIncorrectToast('Os campos Password e Confirme Password são obrigatórios!');
    };
    
    var data: ResetPasswordInterface = {
      email: urlEmail,
      newPassword: password,
      confirmPassword: confirmPassword
    };
    var result = await LoginService.ResetPassword(data);
    if (result == null) {
      setIsLoading(false);
      return showLoginPasswordIncorrectToast('Não foi possível alterar sua senha!');
    }
    showSuccessToast('Senha alterada com sucesso!');
    navigate("/login");
  }

  return (
    <Box component="form"
      sx={{
        '& > :not(style)': { m: 1 },
        display: 'flex',
        flexDirection: 'column',
      }}>

      <Input
        placeholder='Sua senha'
        text='Digite sua nova senha'
        type='password'
        value={password}
        change={onPasswordChange}
        icon={<Padlock />}
      />

      <Input
        placeholder='Sua senha'
        text='Confirme sua nova senha'
        type='password'
        value={confirmPassword}
        change={onConfirmPasswordChange}
        icon={<Padlock />}
      />

      <Box sx={{
        display: 'block'
      }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 500, marginBottom: 2 }}>
          Por segurança, a sua senha deve conter no mínimo:
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'start' }}>

          <Typography sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex', fontFamily: 'Inter', fontWeight: 400, color: '#495057' }}>
            <Check color={password.length >= 8 ? 'success' : undefined} sx={{ marginX: 1, color: 'success' }} />
            8 Caracteres
          </Typography>

          <Typography sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex', fontFamily: 'Inter', fontWeight: 400, color: '#495057' }}>
            <Check color={/[A-Z]/.test(password) ? 'success' : undefined} sx={{ marginX: 1 }} />
            1 Letra maiúscula
          </Typography>

          <Typography sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex', fontFamily: 'Inter', fontWeight: 400, color: '#495057' }}>
            <Check color={/[a-z]/.test(password) ? 'success' : undefined} sx={{ marginX: 1 }} /> 1 Letra minúscula
          </Typography>

          <Typography sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex', fontFamily: 'Inter', fontWeight: 400, color: '#495057' }}>
            <Check color={/[0-9]/.test(password) ? 'success' : undefined} sx={{ marginX: 1 }} /> 1 Digito ('0'-'9')
          </Typography>


          <Typography sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex', fontFamily: 'Inter', fontWeight: 400, color: '#495057' }}>
            <Check color={/[$*&@#]/.test(password) ? 'success' : undefined} sx={{ marginX: 1 }} />1 Caracter não alfanumérico ($,@,!,etc)
          </Typography>
        </Box>

      </Box>

      <ButtonDesign
        isActive={Inactive}
        click={SubmitButton}
        text='Confirmar'
      />
      {isLoading && <MLoading/>}
    </Box>
  );
}