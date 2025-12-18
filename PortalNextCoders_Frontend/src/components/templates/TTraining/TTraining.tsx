import { formatMinutesIntoHours } from "../../../utils/format";
import { useStudent } from "../../../context/StudentProvider/StudentProvider";
import Module from "../../molecules/MTraining/MModule";
import SubModule from "../../molecules/MTraining/MSubModule";
import MForumCard from "../../molecules/MTraining/MForumCard";
import { Trail } from "../../molecules/MTraining/MTrail";
import { useParams } from "react-router-dom";
import { Box, Container, Typography, Paper, Chip, useTheme } from "@mui/material";
import { School, VideoLibrary, Schedule, TrendingUp } from "@mui/icons-material";

function TTraining() {
  const { classes } = useStudent();
  const { courseExtraId } = useParams<{ courseExtraId: string }>();
  const theme = useTheme();

  const EmptyState = () => (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          background: `linear-gradient(135deg, 
            ${theme.palette.primary.main}08 0%, 
            ${theme.palette.secondary.main}12 100%)`,
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <School 
            sx={{ 
              fontSize: 80, 
              color: theme.palette.primary.main,
              opacity: 0.7,
              mb: 2
            }} 
          />
        </Box>
        
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 2
          }}
        >
          Curso em Preparação
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            color: theme.palette.text.secondary,
            mb: 3,
            lineHeight: 1.6
          }}
        >
          Este curso ainda não possui conteúdo disponível
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.palette.text.secondary,
            mb: 4,
            maxWidth: 500,
            mx: 'auto'
          }}
        >
          Nossa equipe está trabalhando para trazer o melhor material educacional para você. 
          Em breve você terá acesso a todo o conteúdo interativo e atualizado.
        </Typography>

        <Chip
          icon={<TrendingUp />}
          label="Conteúdo em desenvolvimento"
          color="primary"
          variant="outlined"
          sx={{ 
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        />
      </Paper>
    </Container>
  );

  if (!classes?.trails || classes.trails.length === 0) {
    return (
      <>
        <EmptyState />
        <MForumCard />
      </>
    );
  }

  return (
    <Container maxWidth="xll" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <VideoLibrary color="primary" />
          Trilhas de Formação
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.palette.text.secondary,
            mb: 3
          }}
        >
          Explore seu conteúdo de aprendizado organizado em trilhas interativas
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {classes.trails.map((trail, index) => {
          const formattedModuleTimeDuration = formatMinutesIntoHours(
            trail.statusProgress.totalTime
          );

          const moduleNumber = (index + 1).toLocaleString("pt-BR", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });

          return (
            <Paper
              key={trail.id}
              elevation={0}
              sx={{
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-2px)',
                },
                background: `linear-gradient(135deg, 
                  ${theme.palette.background.paper} 0%, 
                  ${theme.palette.background.default} 100%)`,
              }}
            >
              <Trail
                trailId={trail.id}
                studentId={classes.studentId}
                title={trail.title}
                title2={trail.description}
                hours={formattedModuleTimeDuration}
                numberModule={moduleNumber}
                concluidedPercent={trail.statusProgress.concluidedPercent || 0}
              >
                <Box sx={{ px: 2, pb: 2 }}>
                  {trail?.modules?.map((module) => {
                    const subModulesQuantity = module?.subModules?.length;
                    const subModulesLabel =
                      subModulesQuantity > 1 ? "seções" : "seção";
                    const subModulesDescription = `${subModulesQuantity} ${subModulesLabel}`;

                    const formattedModuleTimeDuration = formatMinutesIntoHours(
                      module.statusProgress.totalTime
                    );

                    return (
                      <Box 
                        key={module.id}
                        sx={{ 
                          mb: 2,
                          '&:last-child': { mb: 0 }
                        }}
                      >
                        <Module
                          title={module.title}
                          lessons={subModulesDescription}
                          hours={formattedModuleTimeDuration}
                        >
                          <Box sx={{ px: 1 }}>
                            {module?.subModules?.map(
                              (subModule, subModuleIndex, array) => {
                                const formattedSubModuleTimeDuration =
                                  formatMinutesIntoHours(
                                    subModule.statusProgress.totalTime
                                  );
                                const isRouteCourseExtra = courseExtraId !== undefined;
                                const subModulePath = isRouteCourseExtra
                                  ? `/training/extra/${subModule.id}`
                                  : `/training/${subModule.id}`;
                                return (
                                  <Box 
                                    key={subModule.id}
                                    sx={{ 
                                      mb: 1,
                                      '&:last-child': { mb: 0 }
                                    }}
                                  >
                                    <SubModule
                                      subModule={subModule}
                                      hours={formattedSubModuleTimeDuration}
                                      label={subModule.title}
                                      progress={
                                        !subModule.isAllowed
                                          ? 0
                                          : subModule.statusProgress.concluidedPercent || 0
                                      }
                                      assessmentId={subModule.statusProgress.assessmentId}
                                      studentId={classes.studentId}
                                      to={subModulePath}
                                    />
                                  </Box>
                                );
                              }
                            )}
                          </Box>
                        </Module>
                      </Box>
                    );
                  })}
                </Box>
              </Trail>
            </Paper>
          );
        })}
      </Box>
      
      <Box sx={{ mt: 4 }}>
        <MForumCard />
      </Box>
    </Container>
  );
}

export default TTraining;
