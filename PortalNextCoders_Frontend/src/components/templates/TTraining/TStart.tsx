import { Box } from '@mui/system'
import MCardDescription from '../../molecules/MTraining/MCardDescription'
import MForumCard from '../../molecules/MTraining/MForumCard'

function TStart() {
  return (
    <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
        <Box>

        </Box>

        <Box sx={{display: 'flex', flexDirection: 'column'}}>
        <MCardDescription/>
        <MForumCard width='350px' flexDirection='column-reverse' height='320px' alignItems='center' justifyContent='center'/>
        </Box>

    </Box>
  )
}

export default TStart