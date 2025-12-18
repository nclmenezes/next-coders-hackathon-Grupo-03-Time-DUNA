import { Box, List } from '@mui/material'
import Notepad from '../../atoms/Notepad'
import Clock from '@mui/icons-material/AccessTime';
import Calendar from '@mui/icons-material/CalendarMonth';
import Work from '@mui/icons-material/WorkOutline';
import Member from '@mui/icons-material/CardMembership';

function MCardDescription() {
  return (
        <Box sx={{width: '350px'}}>
            <List sx={{px: 1}}>
               <Notepad title='300h de carga horária'
               subtitle='Conteúdo teórico e prático com testes ao final de cada aula.' 
               icon={<Clock color='primary' fontSize='large'/>}/>

                <Notepad title='30 semanas de duração'
                subtitle='Todos os dias você terá uma aula para completar.'
                icon={<Calendar color='primary' fontSize='large'/>}/>

                
                <Notepad title='Certificado de conclusão'
                subtitle='Ao final da formação você receberá o certificado.'
                icon={<Work color='primary' fontSize='large'/>}/>

                
                <Notepad title='Oportunidades de emprego'
                subtitle='Ao final da formação você será direcionado para uma vaga exclusiva.'
                icon={<Member color='primary' fontSize='large'/>}/>
            </List>
        </Box>
      )
}

export default MCardDescription