import {
    Autocomplete,
    CircularProgress,
    TextField,
    MenuItem
} from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import { IAgentClass } from "../../../interfaces/teams/class.interfaces";

interface ISearchAgentClassProps {
    disableSearch: boolean;
    searchLoading: boolean;
    agentClasses: IAgentClass[];
    anotherAgentClass: IAgentClass | null;
    selectAgentClass: (selectedAgentClass: IAgentClass | null) => void;
};

const MSearchAgentClass = ({
    disableSearch,
    searchLoading,
    agentClasses,
    anotherAgentClass,
    selectAgentClass
}: ISearchAgentClassProps) => (
    <Autocomplete
        disabled={disableSearch}
        loading={searchLoading}
        noOptionsText="Nenhuma turma filha está disponível!"
        popupIcon={
            searchLoading ? <CircularProgress color="inherit" size={20} /> :
            <SchoolIcon sx={{ color: '#0A5995' }} />
        }
        loadingText="Obtendo informações das turmas filhas..."
        getOptionDisabled={agentClass =>
            !!anotherAgentClass && 
            agentClass.id === anotherAgentClass.id
        }
        groupBy={(agentClasses)=> agentClasses.maintainer.name}
        renderInput={
            (params, ) =>
                <TextField
                    {...params}
                    label="Turma filha"
                />
        }
        getOptionLabel={
            (agentClass) =>
                `(${agentClass.maintainer.name}) ${agentClass.name}`
        }
        options={
            agentClasses.sort(
                (a, b) =>
                    a.maintainer.name
                        .localeCompare(b.maintainer.name)
            )
        }
        sx={{
            width: 450,
            '.MuiInputBase-root': {
                '&.Mui-focused': {
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0A5995'
                    }
                },
            },
            '.MuiInputLabel-root.Mui-focused': {
                color: '#0A5995'
            },
            '.MuiAutocomplete-groupLabel': { 
                bgcolor: '#0A5995',
                color: 'white'
            }
        }}
        slotProps={{
            popper: {
                sx: {
                    '.MuiAutocomplete-groupLabel': {
                        bgcolor: '#DDDDDD',
                    },
                    '.MuiMenuItem-root[aria-selected="true"]': {
                        bgcolor: '#0000000a',
                        '&:hover': {
                            bgcolor: '#0000000a',
                            color: '#000',
                        },
                        '&.Mui-focused': {
                            bgcolor: '#0000000a',
                            color: '#000',
                        },
                    }

                }
            }
        }}
        renderOption={(props, option) => (
            <MenuItem
                {... props}
                key={option.id}
            >
                {option.name}
            </MenuItem>
        )}
        onChange={
            (_: unknown, value: IAgentClass | null) =>
                selectAgentClass(value)
        }
    />
);

export default MSearchAgentClass;