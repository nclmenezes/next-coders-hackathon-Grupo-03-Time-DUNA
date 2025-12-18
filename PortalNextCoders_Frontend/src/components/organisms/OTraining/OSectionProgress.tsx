import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import moment from "moment";
import "moment/dist/locale/pt-br";
moment.locale("pt-br");
import { StandardCSSProperties } from "@mui/system";
import { Box, Button, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import Schoolcon from "@mui/icons-material/School";
import { useStudent } from "../../../context/StudentProvider/StudentProvider";
import { LinearProgressWithLabel } from "../../atoms/LinearProgress";
import rocket from "../../../assets/Training/rocket.png";
import mask from "../../../assets/Training/masks/maskDiv.png";
import MLoading from "../../molecules/MLoading";
import satisfactionService from "../../../services/api/student/satisfaction.service";

interface props {
  title: string;
  dataInit: string;
  dataFinaly: string;
  value: number;
  mb?: StandardCSSProperties["marginBottom"];
}

function OSectionProgress({ mb }: props) {
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { setCheckStudentResponse, classes } = useStudent(); 

  const findClasses = async () => {
    setLoading(true);
    try { 
      const allTrailIds: number[] = classes!.trails.map((trail) => trail.id);
      const checkStudentResponses = await satisfactionService.getStudentResponses(
        allTrailIds,
        classes!.studentId
      );
      setCheckStudentResponse(checkStudentResponses);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const disabledCurrentSubModule = () => {
    var active =
      classes?.activeCurrentSubModule === null
        ? false
        : classes?.activeCurrentSubModule;
    return classes?.currentSubModuleId !== null && active ? true : false;
  };

  useEffect(() => {
    findClasses();
  }, [classes]);

  const formattedTrailStartDate = moment(classes?.startDate).format("MMM YY");

  const formattedTrailEndDate = moment(classes?.endDate).format("MMM YY");

  const handleClick = () => {
    if (classes?.currentSubModuleId === null) return;
    navigate(`/training/${classes?.currentSubModuleId}`);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${mask})`,
        display: "flex",
        bgcolor: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
        width: "100%",
        height: 160,
        borderRadius: "16px",
        my: 2,
        mb: mb,
        py: 3,
        px: 4,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
          pointerEvents: "none",
        },
      }}
    >
      {loading ? (
        <MLoading />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "85%",
            zIndex: 1,
          }}
        >
          <Box sx={{ pb: 2.5 }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: "26px",
                color: "#1a202c",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                mb: 0.5,
              }}
            >
              {classes?.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: "15px",
                color: "#4a5568",
                lineHeight: 1.4,
                opacity: 0.9,
              }}
            >
              {classes?.description}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              disableRipple
              variant="contained"
              {...(disabledCurrentSubModule() && { onClick: handleClick })}
              sx={{
                background:
                  classes?.currentSubModuleId === null
                    ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
                    : "linear-gradient(135deg, #4263EB 0%, #6366f1 100%)",
                "&:hover": {
                  background:
                    classes?.currentSubModuleId === null
                      ? "linear-gradient(135deg, #218838 0%, #1ea888 100%)"
                      : "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(66, 99, 235, 0.3)",
                },
                height: 48,
                minWidth: 180,
                color: "#FFFFFF",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "14px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(66, 99, 235, 0.2)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: disabledCurrentSubModule() ? "pointer" : "not-allowed",
                opacity: disabledCurrentSubModule() ? 1 : 0.7,
                "&:disabled": {
                  background: "#6c757d",
                  color: "#ffffff",
                  opacity: 0.7,
                },
              }}
              disabled={
                !disabledCurrentSubModule() &&
                classes?.currentSubModuleId !== null
              }
            >
              {classes?.currentSubModuleId === null
                ? "✅ Curso Finalizado"
                : "Iniciar Próxima Aula"}
            </Button>

            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <LinearProgressWithLabel
                value={classes?.statusProgress?.concluidedPercent || 0}
                width="100%"
                direction="column-reverse"
                align="start"
                text="completo"
              />

              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "end",
                  gap: 2,
                  mt: 1,
                  flexWrap: "wrap",
                }}
              >
                {classes?.startDate && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <EventIcon
                      color="primary"
                      sx={{
                        fontSize: "18px",
                        color: "#4263EB",
                      }}
                    />
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontFamily: "Inter",
                        fontWeight: 500,
                        color: "#2d3748",
                        fontSize: "14px",
                        textTransform: "capitalize",
                      }}
                    >
                      Início: {formattedTrailStartDate}
                    </Typography>
                  </Box>
                )}

                {classes?.endDate && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Schoolcon
                      color="primary"
                      sx={{
                        fontSize: "18px",
                        color: "#4263EB",
                      }}
                    />
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontFamily: "Inter",
                        fontWeight: 500,
                        color: "#2d3748",
                        fontSize: "14px",
                        textTransform: "capitalize",
                      }}
                    >
                      Fim: {formattedTrailEndDate}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      <Box
        id="rocket"
        sx={{
          position: "relative",
          bottom: "40px",
          zIndex: 2,
          filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px) rotate(5deg)",
          },
        }}
      >
        <img
          alt="foguete"
          src={rocket}
          style={{
            maxHeight: "120px",
            width: "auto",
            marginTop: "20px",
          }}
        />
      </Box>
    </Box>
  );
}

export default OSectionProgress;
