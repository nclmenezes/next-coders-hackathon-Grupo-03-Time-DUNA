import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Person4Icon from "@mui/icons-material/Person4";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import StudentProfessionalProfileService from "../../../services/api/student/studentProfessionalProfile.service";
import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";

const MStudentProfileMenu = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { name, email, id } = user || {};
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [studentPhotoUrl, setStudentPhotoUrl] = useState<string | undefined>(
    undefined
  );
  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const fetchAvatarUrl = async () => {
    if (!id) return;
    const photoUrl =
      await StudentProfessionalProfileService.GetProfessionalProfilePhotoUrl(
        id
      );
    if (photoUrl) setStudentPhotoUrl(photoUrl);
  };

  useEffect(() => {
    fetchAvatarUrl();
  }, []);

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: "20px", cursor: "pointer" }}
        onClick={handleClick}
        
      >
        <Tooltip title="Perfil do Aluno">
          <IconButton>
            <Avatar sx={{ width: 32, height: 32 }} src={studentPhotoUrl}>
              <Box sx={{ lineHeight: "0.8em", fontSize: "0.8em" }}>
                {name && name[0].toUpperCase()}
              </Box>
            </Avatar>
          </IconButton>
        </Tooltip>
        <a style={{ color: "#495057" }}>{user?.name}</a>
        <ChevronLeftOutlined style={{ transform: 'rotate(270deg)' , color: '#9EA6AD' }}/>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 8px 32px rgba(0,0,0,0.12))",
            mt: 1.5,
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            minWidth: "280px",
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "24px 20px 16px 20px",
            gap: "12px",
            background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
            borderRadius: "16px 16px 0 0",
            margin: "-1px -1px 0 -1px",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255,255,255,0.1)",
              borderRadius: "16px 16px 0 0",
              pointerEvents: "none",
            }
          }}
        >
          <Avatar
            sx={{ 
              width: "56px !important", 
              height: "56px !important",
              border: "3px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              zIndex: 1,
            }}
            src={studentPhotoUrl}
          >
            <Box sx={{ 
              lineHeight: "1em", 
              fontSize: "1.2em",
              color: "#2563eb",
              fontWeight: "600"
            }}>
              {name && name[0].toUpperCase()}
            </Box>
          </Avatar>
          <Box sx={{ 
            lineHeight: "1.4em", 
            textAlign: "center",
            color: "white",
            zIndex: 1,
          }}>
            <Box sx={{ 
              fontWeight: "600", 
              fontSize: "1.1em",
              marginBottom: "4px",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              {name}
            </Box>
            <Box sx={{ 
              fontSize: "0.9em",
              opacity: 0.9,
              textShadow: "0 1px 2px rgba(0,0,0,0.1)"
            }}>
              {email}
            </Box>
          </Box>
        </Box>
        <Divider sx={{ margin: 0, borderColor: "rgba(0,0,0,0.08)" }} />
        <Box sx={{ padding: "8px 0" }}>
          <MenuItem 
            onClick={() => navigate("/profile/edit-data")}
            sx={{
              padding: "12px 20px",
              margin: "4px 8px",
              borderRadius: "12px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(102, 126, 234, 0.08)",
                transform: "translateX(4px)",
                "& .MuiListItemIcon-root": {
                  color: "#667eea",
                },
                "& .MuiTypography-root": {
                  color: "#667eea",
                  fontWeight: "500",
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: "40px", transition: "color 0.2s ease-in-out" }}>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <Box sx={{ fontSize: "0.95em", transition: "all 0.2s ease-in-out" }}>
              Configurações da conta
            </Box>
          </MenuItem>
          <MenuItem 
            onClick={() => navigate("/profile/edit-professional-data")}
            sx={{
              padding: "12px 20px",
              margin: "4px 8px",
              borderRadius: "12px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(102, 126, 234, 0.08)",
                transform: "translateX(4px)",
                "& .MuiListItemIcon-root": {
                  color: "#667eea",
                },
                "& .MuiTypography-root": {
                  color: "#667eea",
                  fontWeight: "500",
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: "40px", transition: "color 0.2s ease-in-out" }}>
              <Person4Icon fontSize="small" />
            </ListItemIcon>
            <Box sx={{ fontSize: "0.95em", transition: "all 0.2s ease-in-out" }}>
              Meu perfil profissional
            </Box>
          </MenuItem>
          <Divider sx={{ margin: "8px 16px", borderColor: "rgba(0,0,0,0.06)" }} />
          <MenuItem 
            onClick={() => signOut()}
            sx={{
              padding: "12px 20px",
              margin: "4px 8px",
              borderRadius: "12px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                transform: "translateX(4px)",
                "& .MuiListItemIcon-root": {
                  color: "#ef4444",
                },
                "& .MuiTypography-root": {
                  color: "#ef4444",
                  fontWeight: "500",
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: "40px", transition: "color 0.2s ease-in-out" }}>
              <MeetingRoomIcon fontSize="small" />
            </ListItemIcon>
            <Box sx={{ fontSize: "0.95em", transition: "all 0.2s ease-in-out" }}>
              Sair
            </Box>
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
};

export default MStudentProfileMenu;
