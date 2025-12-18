import { useNavigate } from "react-router";
import {
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Chip,
  useTheme,
  Tooltip,
  Paper,
} from "@mui/material";
import Play from "@mui/icons-material/PlayCircleOutline";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LinearProgressWithLabel } from "../../atoms/LinearProgress";
import { SubModuleDto } from "../../../interfaces/StudentContents/Responses/Classes";
import { useState } from "react";
import { OTrialDetail } from "../../organisms/OTrail/OTrialDetail";

interface props {
  hours: string;
  label: string;
  progress: number;
  assessmentId: number | null;
  studentId: number;
  subModule: SubModuleDto;
  to: string;
}

function SubModule({
  hours,
  label,
  progress,
  assessmentId,
  subModule,
  to,
  studentId,
}: props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentAssessmentId, setCurrentAssessmentId] = useState<number>(0);
  const [openModalTrial, setOpenModalTrial] = useState<boolean>(false);

  const handleClick = () => {
    navigate(to);
  };

  const handleTrialOpen = (assessmentId: number) => {
    setCurrentAssessmentId(assessmentId);
    setOpenModalTrial(true);
  };

  const handleTrialClose = () => {
    setOpenModalTrial(false);
  };

  const getStatusIcon = () => {
    if (!subModule.isAllowed) {
      return <LockIcon sx={{ color: theme.palette.text.disabled }} />;
    }
    if (progress === 100) {
      return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
    }
    return <Play sx={{ color: theme.palette.primary.main }} />;
  };

  const getStatusChip = () => {
    if (!subModule.isAllowed) {
      return (
        <Chip 
          label="Bloqueado" 
          size="small" 
          variant="outlined"
          sx={{ 
            color: theme.palette.text.disabled,
            borderColor: theme.palette.text.disabled,
            fontSize: '0.75rem'
          }} 
        />
      );
    }
    if (progress === 100) {
      return (
        <Chip 
          label="Concluído" 
          size="small" 
          color="success"
          sx={{ fontSize: '0.75rem' }} 
        />
      );
    }
    if (progress > 0) {
      return (
        <Chip 
          label="Em andamento" 
          size="small" 
          color="primary"
          variant="outlined"
          sx={{ fontSize: '0.75rem' }} 
        />
      );
    }
    return (
      <Chip 
        label="Não iniciado" 
        size="small" 
        variant="outlined"
        sx={{ fontSize: '0.75rem' }} 
      />
    );
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          cursor: subModule.isAllowed ? "pointer" : "not-allowed",
          opacity: subModule.isAllowed ? 1 : 0.7,
          '&:hover': subModule.isAllowed ? {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-1px)',
            borderColor: theme.palette.primary.main,
          } : {},
          background: subModule.isAllowed 
            ? theme.palette.background.paper 
            : theme.palette.action.disabledBackground,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <ListItemButton
            disableRipple
            {...(subModule.isAllowed && { onClick: handleClick })}
            sx={{
              flex: 1,
              py: 2,
              px: 3,
              '&:hover': {
                backgroundColor: 'transparent',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 48 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: subModule.isAllowed 
                    ? `${theme.palette.primary.main}15` 
                    : `${theme.palette.text.disabled}15`,
                }}
              >
                {getStatusIcon()}
              </Box>
            </ListItemIcon>
            
            <Box sx={{ flex: 1, mr: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    color: subModule.isAllowed 
                      ? theme.palette.text.primary 
                      : theme.palette.text.disabled,
                    fontSize: '0.95rem',
                  }}
                >
                  {label}
                </Typography>
                {getStatusChip()}
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <LinearProgressWithLabel 
                  value={progress} 
                  hours={hours}
                  width="100%"
                />
              </Box>
            </Box>
          </ListItemButton>

          <Box sx={{ pr: 2 }}>
            <Tooltip title="Avaliação">
              <IconButton
                disabled={!subModule.releaseTrial}
                onClick={() => handleTrialOpen(assessmentId!)}
                sx={{
                  backgroundColor: subModule.releaseTrial 
                    ? `${theme.palette.secondary.main}20` 
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: subModule.releaseTrial 
                      ? `${theme.palette.secondary.main}30` 
                      : 'transparent',
                  }
                }}
              >
                <ContentPasteIcon
                  sx={{
                    color: subModule.releaseTrial 
                      ? theme.palette.primary.main 
                      : theme.palette.text.disabled,
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      <OTrialDetail
        open={openModalTrial}
        onClose={handleTrialClose}
        assessmentId={currentAssessmentId}
        studentId={studentId === undefined ? 0 : Number(studentId)}
      />
    </>
  );
}

export default SubModule;
