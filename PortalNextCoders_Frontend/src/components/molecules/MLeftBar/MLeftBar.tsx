import { useRef, useState, useEffect, ReactNode } from "react";
import {
  useLocation,
  useNavigate
} from "react-router";
import {
  useMediaQuery,
  useTheme,
  styled,
  Box,
  Drawer,
  List,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Typography,
  Collapse,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import logoAdmin from "../../../assets/logo-admin.png";
import logoStudent from "../../../assets/logo-student.png";
import { UserRoleEnum } from "../../../enums";
import { prop } from "../../../interfaces/routes/drawerOptions.interface";
import LogoImg from '../../../assets/logo.png';
import { useStudent } from "../../../context/StudentProvider/StudentProvider";
import { useStudentCourses } from "../../../hooks/useStudentCourses";

interface IListItemLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
  onClick: (() => void) | any;
  showLabel: boolean;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  isSubmenuItem?: boolean;
};

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 2),
  ...theme.mixins.toolbar,
  justifyContent: "center",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  position: "relative",
  height: "50px",
  marginTop: "10px",
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: "4px 12px",
  borderRadius: "12px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    backgroundColor: "rgba(143, 145, 245, 0.08)",
    transform: "translateX(4px)",
    "&::before": {
      opacity: 1,
    },
  },
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "3px",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&.Mui-selected": {
    backgroundColor: "rgba(141, 152, 250, 0.12)",
    "&::before": {
      opacity: 1,
    },
    "&:hover": {
      backgroundColor: "rgba(148, 150, 250, 0.15)",
    },
    "& .MuiListItemIcon-root": {
      color: "#101420ff",
    },
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: "40px",
  color: "#666",
  transition: "color 0.3s ease",
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  "& .MuiListItemText-primary": {
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "Inter, sans-serif",
  },
}));

const ListItemLink: React.FC<IListItemLinkProps> = ({
  to,
  icon,
  label,
  onClick,
  showLabel,
  hasSubmenu = false,
  isExpanded = false,
  isSubmenuItem = false,
  ...otherProps
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const regex = new RegExp(`${to}(?:\/\\d+)?(?:\/\\d+)?`);
  const isActive =
    (location.pathname === "/" && to === "/") ||
    (location.pathname !== "/" && to !== "/" && regex.test(location.pathname));

  const handleClick = () => {
    if (onClick && typeof onClick === 'function') {
      onClick();
    } else if (!hasSubmenu) {
      navigate(to);
    }
  };

  const itemContent = (
    <StyledListItemButton 
      selected={isActive} 
      onClick={handleClick} 
      sx={{ 
        ...(isSubmenuItem && { pl: 4 }),
        margin: isSubmenuItem ? '2px 12px 2px 20px' : '4px 12px'
      }} 
      {...otherProps}
    >
      <StyledListItemIcon>
        {icon}
      </StyledListItemIcon>
      {showLabel && (
        <>
          <StyledListItemText primary={label} />
          {hasSubmenu && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
        </>
      )}
    </StyledListItemButton>
  );

  return showLabel ? (
    itemContent
  ) : (
    <Tooltip title={label} placement="right" arrow>
      {itemContent}
    </Tooltip>
  );
};

const MLeftBar = ({ drawerOptions }: prop) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();
  const { role } = user || {};
  const isAdmin = role === UserRoleEnum.admin;
  const [open, setOpen] = useState<boolean>(true);
  const [drawerWidth, setDrawerWidth] = useState<number>(70);
  const listRef = useRef<HTMLUListElement>(null);
      const { hasPrimaryCourses, courses } = useStudentCourses();
      const { classes: studentClasses } = useStudent();  const navigate = useNavigate();
  const [trainingExpanded, setTrainingExpanded] = useState<boolean>(false);

  const handleTrainingToggle = () => {
    setTrainingExpanded(!trainingExpanded);
  };

  useEffect(() => {
    if (open && listRef.current) {
        const maxWidth = Array.from(listRef.current.querySelectorAll('.MuiListItemText-primary'))
            .reduce((max, item) => {
                if (item instanceof HTMLElement) return Math.max(max, item.offsetWidth);
                return max;
            }, 0);
        setDrawerWidth(Math.max(280, maxWidth + 80));
        return;
    };
    setDrawerWidth(72);
}, [open, drawerOptions]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
              variant="persistent"
              open={true}
              sx={{
                  width: drawerWidth,
                  '& .MuiDrawer-paper': {
                      width: drawerWidth,
                      transition: 'width 0.3s ease-in-out'
                  }
              }}
      >
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{
            position: 'absolute',
            top: 90,
            right: 0,
            zIndex: 1,
            background: '#6EB700',
            borderRadius: '20px 0 0 20px',
            color: '#FFFFFF',
            width: 30,
            height: 30,
            '&:hover': { background: '#6EB700' }
          }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>

        <DrawerHeader
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '15px 5px'
          }}
        >
          <Box sx={{ display: 'flex'}}>
            {
              open ?
                <img
                  style={{ width: "130px", height: "60px" }}
                  src={ isAdmin ? logoAdmin : logoStudent }
                /> : <img
            src={LogoImg}
            alt="Prime"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
            }
          </Box>
        </DrawerHeader>


        <List ref={listRef} sx={{ marginTop: '60px' }}>
          {
            drawerOptions
              .filter((item) => {
                if (item.roles && !item.roles.includes(user?.role || "")) {
                  return false;
                }
                 
                if (user?.role === UserRoleEnum.student) {
                  const restrictedPaths = ["/bonus", "/calendar/:id", "/liveclass"];
                  if (item.path && restrictedPaths.includes(item.path)) {
                    return hasPrimaryCourses();
                  }
                }
                
                return true;
              })
                            .map((drawerOption) => {
                if (drawerOption.element) {
                  return (
                    <ListItemButton sx={{ margin: "4px 12px", borderRadius: "12px" }}>
                      {drawerOption.icon && <StyledListItemIcon>{drawerOption.icon}</StyledListItemIcon>}
                      {open && <StyledListItemText primary={drawerOption.label} />}
                      {open && drawerOption.element}
                    </ListItemButton>
                  )
                }

                if (drawerOption.path === "/training" && user?.role === UserRoleEnum.student) {
                  return (
                    <Box key={drawerOption.path}>
                      <ListItemLink
                        to={drawerOption.path}
                        icon={drawerOption.icon}
                        label={drawerOption.label}
                        showLabel={open}
                        hasSubmenu={true}
                        isExpanded={trainingExpanded}
                        onClick={handleTrainingToggle}
                      />
                      <Collapse in={trainingExpanded && open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {courses?.primaryCourses?.map((course) => (
                            <ListItemLink
                              key={`primary-${course.id}`}
                              to={`/training/primary/${course.id}`}
                              icon={<span style={{ fontSize: '12px' }}>📚</span>}
                              label={course.name}
                              showLabel={true}
                              isSubmenuItem={true}
                              onClick={() => {
                                navigate('/training');
                                if (smDown) setOpen(false);
                              }}
                            />
                          ))}
                          
                          {courses?.extraCourseRegister?.map((course) => (
                            <ListItemLink
                              key={`extra-${course.id}`}
                              to={`/training/courseExtra/${course.id}`}
                              icon={<span style={{ fontSize: '12px' }}>📖</span>}
                              label={course.name}
                              showLabel={true}
                              isSubmenuItem={true}
                              onClick={() => {
                                navigate(`/training/courseExtra/${course.id}`);
                                if (smDown) setOpen(false);
                              }}
                            />
                          ))}
                        </List>
                      </Collapse>
                    </Box>
                  );
                }

                if (drawerOption.label === 'Meus Pagamentos') {
                  return (
                    <ListItemLink
                      to={`/payments/student/${user?.id}/class/${studentClasses?.id}`}
                      key={drawerOption.path}
                      icon={drawerOption.icon}
                      label={drawerOption.label}
                      showLabel={open}
                      onClick={smDown ? () => setOpen(false) : undefined}
                    />
                  );
                }

                return (
                  <ListItemLink
                    to={drawerOption.path || ''}
                    key={drawerOption.path}
                    icon={drawerOption.icon}
                    label={drawerOption.label}
                    showLabel={open}
                    onClick={smDown ? () => setOpen(false) : undefined}
                  />
                );
              })
          }
        </List>
      </Drawer>
    </Box>
  );
};

export default MLeftBar;