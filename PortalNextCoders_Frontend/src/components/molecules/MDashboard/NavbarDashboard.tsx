import React, {useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Badge,
  Box,
  IconButton,
  Typography,
  Menu,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Divider,
  Breadcrumbs,
  Stack,
  Link,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Alertas from "@mui/icons-material/NotificationsNone";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { useAuth } from "../../../context/AuthProvider/useAuth";
import { useStudent } from "../../../context/StudentProvider/StudentProvider";
import StudentProfessionalProfileService from "../../../services/api/student/studentProfessionalProfile.service";

function NavbarDashboard() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [count, setCount] = React.useState(0);
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const { content } = useStudent();
  
  
  useEffect(() => {
    const fetchAvatarUrl = async () => {
      const imgUrl = await StudentProfessionalProfileService.GetProfessionalProfilePhotoUrl(user?.id ?? 0);
      if (imgUrl) {
        setAvatarUrl(imgUrl);
      }
    };

    fetchAvatarUrl();
  }, [user]);
  const renderStaticBreadcrumb = () => {
    const candidateRegex = /^\/candidates\/detail\/\d+$/;
    const teamRegex = /^\/class\/detail\/\d+$/;
    const contentRegex = /^\/training\/\d+$/;

    const homeIcon = [
      <HomeIcon
        key="0"
        onClick={() => navigate("/")}
        sx={{
          display: { xs: "none", md: "flex" },
          color: "#2342C0",
          cursor: "pointer",
        }}
      />,
    ];

    if (location.pathname === "/") {
      return [
        <HomeIcon
          key="0"
          sx={{
            display: { xs: "none", md: "flex" },
            color: "#2342C0",
          }}
        />,
      ];
    }

    if (location.pathname === "/candidates") {
      return [
        ...homeIcon,
        <Typography key="1" color="text.primary">
          Candidatos
        </Typography>,
      ];
    }

    if (location.pathname === "/reports") {
      return [
        ...homeIcon,
        <Typography key="1" color="text.primary">
          Relatórios
        </Typography>,
      ];
    }

    if (location.pathname === "/training") {
      return [
        ...homeIcon,
        <Typography key="1" color="text.primary">
          Formação
        </Typography>,
      ];
    }

    if (location.pathname === "/bonus") {
      return [
        ...homeIcon,
        <Typography key="1" color="text.primary">
          Gamificação
        </Typography>,
      ];
    }

    if (location.pathname === "/class") {
      return [
        ...homeIcon,
        <Typography key="1" color="text.primary">
          Turmas
        </Typography>,
      ];
    } 
    
    if (location.pathname === "/contractor") {
      return [
        ...homeIcon,
        <Typography key="1" color="text.primary">
          Contratantes
        </Typography>,
      ];
    }

    if (contentRegex.test(location.pathname)) {
      if (content[0]?.contentType === "Test") {
        return [
          ...homeIcon,
          <Link
            key="1"
            onClick={() => navigate("/training")}
            sx={{ cursor: "pointer" }}
            underline="hover"
          >
            Formação
          </Link>,
          <Typography key="2" color="text.primary">
            Avaliação
          </Typography>,
        ];
      }

      return [
        ...homeIcon,
        <Link
          key="1"
          onClick={() => navigate("/training")}
          sx={{ cursor: "pointer" }}
          underline="hover"
        >
          Formação
        </Link>,
        <Typography key="2" color="text.primary">
          {content[0]?.name}
        </Typography>,
      ];
    }

    if (candidateRegex.test(location.pathname)) {
      return [
        ...homeIcon,
        <Link
          key="1"
          onClick={() => navigate("/candidates")}
          sx={{ cursor: "pointer" }}
          underline="hover"
        >
          Candidatos
        </Link>,
        <Typography key="2" color="text.primary">
          Detalhes do Candidato
        </Typography>,
      ];
    }

    if (teamRegex.test(location.pathname)) {
      return [
        ...homeIcon,
        <Link
          key="1"
          onClick={() => navigate("/candidates")}
          sx={{ cursor: "pointer" }}
          underline="hover"
        >
          Turmas
        </Link>,
        <Typography key="2" color="text.primary">
          Detalhes da Turma
        </Typography>,
      ];
    }

    return [];
  };

  const editData = async () => {
    navigate("/profile/edit-data");
  };
  
  const editProfessionalData = async () => {
    navigate("/profile/edit-professional-data");
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Box sx={{ ml: 2, flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        <Stack spacing={2}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {renderStaticBreadcrumb()}
          </Breadcrumbs>
        </Stack>
      </Box>

      <Box
        sx={{
          flexGrow: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tooltip title="Perfil do aluno">
          <IconButton onClick={handleOpenUserMenu} sx={{ ml: 5, p: 0 }}>
            <Avatar src={avatarUrl}/>
          </IconButton>
        </Tooltip>

        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem>
            <Typography color="#67a10f">
              <b>{user?.name}</b>
            </Typography>
          </MenuItem>
          <MenuItem dense>
            <Typography variant="overline" color="#0a5995">
              {user?.email}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={editData}>
            <Typography textAlign="center">Minha conta</Typography>
          </MenuItem> 
          <MenuItem onClick={editProfessionalData}>
            <Typography textAlign="center">Perfil Profissional</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              signOut();
            }}
          >
            <Typography textAlign="center">Sair</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}

export default NavbarDashboard;
