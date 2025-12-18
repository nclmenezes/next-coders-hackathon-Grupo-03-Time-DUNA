import { Box } from '@mui/material'
import OResultAssessment from '../../../organisms/OClass/Assessment/OResultAssessment';

interface TResultAssessment {
  assessmentId: number;
  studentId: number;
  subModuleId: number;
  contentId: number;
  trailId : number;
}

function TResultAssessment({assessmentId, studentId, subModuleId, contentId, trailId}: TResultAssessment) {
  return (
    <Box sx={{ width: "100%", display: "flex" }}>
      <Box id="content" sx={{ width: "100%" }}>
      <OResultAssessment 
        assessmentId={assessmentId} 
        studentId={studentId} 
        subModuleId={subModuleId}
        contentId={contentId}
        trailId = {trailId}
        />
      </Box>
    </Box>    
  )
}

export default TResultAssessment