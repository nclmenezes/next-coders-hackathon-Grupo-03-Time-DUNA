import { Box } from '@mui/material'
import MForumCard from '../../molecules/MTraining/MForumCard'

function TCareer() {
  return (
    <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
        <Box>

        </Box>

        <Box sx={{display: 'flex', flexDirection: 'column'}}>
        <MForumCard width='350px' flexDirection='column-reverse' height='320px' alignItems='center' justifyContent='center'/>
        </Box>

    </Box>
  )
}

export default TCareer