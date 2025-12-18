import * as React from "react";
import { ReactNode, useState } from "react";
import { Outlet, useMatch, useNavigate, useResolvedPath } from "react-router";

import {
  useMediaQuery,
  useTheme,
  styled,
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import logo from "../../../assets/logo.png";
import Navbar from "../MDashboard/NavbarDashboard";

export interface isClassDrawerOptions {
  icon: ReactNode;
  label: string;
  path: string;
}

interface prop {
  classDrawerOptions: isClassDrawerOptions[];
}

interface IListItemLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
  onClick: (() => void) | any;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  anchor: "right",
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(${drawerWidth}px - 100%)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const drawerWidth = 321;

export const ListItemLink: React.FC<IListItemLinkProps> = ({
  to,
  icon,
  label,
  onClick,
}) => {
  const navigate = useNavigate();

  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: false });

  const handleClick = () => {
    navigate(to);
    onClick?.();
  };

  return (
    <ListItemButton selected={!!match} onClick={handleClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

export default function ClassSidebar({ classDrawerOptions }: prop) {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        elevation={0}
        className="appBar"
        open={open}
        style={{
          background: "#FFFFFF",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="end"
            sx={{ mr: 3, ...(open && { display: "none" }) }}
          >
            <MenuIcon style={{ color: "black" }} />
          </IconButton>

          <Navbar />
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#FFFFFF",
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingY: 2,
            mb: 8,
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: " center",
                justifyContent: "center",
                background: "#0A5995",
                width: "40px",
                height: "49px",
                mt: 0.2,
                mx: 2,
                color: "#FFFFFF",
                borderRadius: 2,
              }}
            >
              <ChevronRightIcon sx={{ mx: -2, ml: 0.1, display: "flex" }} />
              <ChevronLeftIcon />
            </Box>
            <img style={{ width: "130px", height: "60px" }} src={logo} />
          </Box>

          <Box sx={{ display: "flex", position: "fixed", left: 300, top: 100 }}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon
                  style={{
                    background: "#6EB700",
                    borderRadius: 20,
                    color: "#FFFFFF",
                  }}
                />
              ) : (
                <ChevronRightIcon
                  style={{
                    background: "#6EB700",
                    borderRadius: 20,
                    color: "#FFFFFF",
                  }}
                />
              )}
            </IconButton>
          </Box>
        </DrawerHeader>

        <List component="nav">
          {classDrawerOptions.map((drawerOption) => (
            <ListItemLink
              to={drawerOption.path}
              key={drawerOption.path}
              icon={drawerOption.icon}
              label={drawerOption.label}
              onClick={smDown ? setOpen : undefined}
            />
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}
