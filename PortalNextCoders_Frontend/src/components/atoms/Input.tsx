import { ReactNode } from "react";

import dayjs from 'dayjs';
import InfoIcon from '@mui/icons-material/Info';
import {Box, TextField, InputAdornment, Typography, Autocomplete, MenuItem, Select} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {MuiTelInput} from "mui-tel-input";
import {SelectLocal} from "../../interfaces/profile/profile";

interface props {
  text: string;
  icon?: ReactNode;
  placeholder?: string;
  type?: string;
  value: string;
  change?: (param?: any, param2?: any) => void;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | undefined>
}

interface propsBirthDate {
  text: string;
  value: any;
  change: (value: dayjs.Dayjs | null, keyboardInputValue?: string | undefined) => void;
}

interface propsSelect {
  text: string;
  options: any[];
  optionEqual: (param?: any, param2?: any) => boolean;
  value: string;
  change: (param?: any, param2?: any) => void;
}

function Input({ text, placeholder, type, value, change, icon, disabled = false }: props) {
  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 400, position: 'relative', left: 20, bottom: 4, color: '#212429' }}>
        {text}
      </Typography>

      <TextField
        sx={{
          width: { xs: '37ch', md: '53ch' },
          marginBottom: 2,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'black',
              borderRadius: 2,
            },
          },
        }}
        value={value}
        type={type}
        onChange={change}
        placeholder={placeholder}
        disabled={disabled}
        required
        inputProps={{
          minLength: 4,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {icon}
            </InputAdornment>
          ),
        }}
      />
    </Box>

  );
}

export default Input;

export function InputCpf({ text, placeholder, type, value, change, icon }: props) {
  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 400, position: 'relative', left: 20, bottom: 4, color: '#212429' }}>
        {text}
      </Typography>

      <TextField
        sx={{
          width: { xs: '37ch', md: '53ch' },
          marginBottom: 2,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'black',
              borderRadius: 2,
            },
          },
        }}
        value={value}
        type={type}
        onChange={change}
        placeholder={placeholder}
        required
        inputProps={{
          minLength: 11,
        }}
      />
    </Box>

  );
}

export function DatePicker({ text, value, change }: propsBirthDate) {
    // @ts-ignore
    return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 400, position: 'relative', left: 20, bottom: 4, color: '#212429' }}>
        {text}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          inputFormat="DD/MM/YYYY"
          views={['year', 'month', 'day']}
          openTo='year'
          maxDate={dayjs('01-01-2008')}
          disableFuture
          value={value}
          // @ts-ignore
          onChange={change}
          // @ts-ignore
          renderInput={(params) => <TextField {...params}
            sx={{
              display: 'flex',
              width: { xs: '37ch', md: '53ch' },
              marginBottom: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'black',
                  borderRadius: 2,
                },
              },
            }}
          />}
        />
      </LocalizationProvider>

      <Typography sx={{
        fontFamily: 'Inter', fontWeight: 400, display: 'flex',
        position: 'relative', left: 10, paddingBottom: 2, color: '#D88810',
      }}>
        {<InfoIcon sx={{ marginX: 1 }} />} Idade mínima: 16 anos
      </Typography>
    </Box>
  );
}

export function SelectInput({ text, value, change, options, optionEqual }: propsSelect) {
    const lines = text.split('\n').map((line, index) => (
        <Typography key={index} sx={{ fontFamily: 'Inter', fontWeight: 400, position: 'relative', left: 15, bottom: 4, color: '#212429' }}>
            {line}
        </Typography>
    ));

    return (
        <Box>
            {lines}
            <Autocomplete
                sx={{
                    width: { xs: '37ch', md: '53ch' },
                    marginBottom: 2,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'black',
                            borderRadius: 2,
                        },
                    },
                }}
                clearOnEscape
                options={options}
                value={value}
                isOptionEqualToValue={optionEqual}
                onChange={change}
                renderInput={(params) => <TextField  required {...params} />}
            />
        </Box>
    );
}

export function InputEmail({ text, placeholder, type, value, change, inputRef }: props) {
  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 400, position: 'relative', left: 20, bottom: 4, color: '#212429' }}>
        {text}
      </Typography>

      <TextField
        sx={{
          width: { xs: '37ch', md: '53ch' },
          marginBottom: 2,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'black',
              borderRadius: 2,
            },
          },
        }}
        value={value}
        type={type}
        onChange={change}
        placeholder={placeholder}
        required
        inputProps={{
          minLength: 8,
          pattern: '^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$'
        }}
        inputRef={inputRef}
        />
    </Box>

  );
}

export function SelectAddress({ changeCity, textUf, textCity, valueUf, valueCity, citys, disabled}: SelectLocal) {
    return (
        <Box sx={{
            display: 'flex',
            width: { xs: '37ch', md: '53ch' },
            pb: 2
        }}>
            <Box id='labelSelect'>
                <Typography variant='subtitle1'
                            sx={{ ml: 2 }}>
                    {textUf}
                </Typography>

                <Select
                    value={valueUf}
                    disabled={disabled}
                    sx={{
                        borderRadius: 2,
                        width: '10ch', mr: 5,
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black'
                        },
                    }}>
                    <option value="0">Selecione um Estado</option>
                    <MenuItem
                        value={valueUf}
                    >
                        {valueUf}
                    </MenuItem>
                </Select>
            </Box>


            <Box id='labelCity'>
                <Typography variant='subtitle1'
                            sx={{ml: 2}}>
                    {textCity}
                </Typography>

                <Select sx={{
                    borderRadius: 2,
                    width: {xs: '18.9ch', md: '33.5ch'},
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black',
                    }
                }}
                        value={valueCity}
                        onChange={changeCity}
                        disabled={disabled}
                >
                    <option value="0">Selecione uma cidade</option>
                    {citys.map((city: any) => (
                        <MenuItem key={city.id} value={city.nome}
                        >
                            {city.nome }
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        </Box>
    )
}
export function InputTelephone({ text, placeholder, value, change, disabled }: props) {

    return (

        <Box>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 400, position: 'relative', left: 20, bottom: 4, color: '#212429' }}>
                {text}
            </Typography>

            <MuiTelInput
                sx={{
                    width: { xs: '37ch', md: '53ch' },
                    marginBottom: 2,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'black',
                            borderRadius: 2,
                        },
                    },
                }}
                value={value}
                defaultCountry={"BR"}
                inputProps={{
                    minLength: 12,
                    maxLength: 13
                }}
                onChange={change}
                required
                disabled={disabled}
                disableDropdown={true}
                onlyCountries={['BR']}
                forceCallingCode
            />
        </Box>
    );
}