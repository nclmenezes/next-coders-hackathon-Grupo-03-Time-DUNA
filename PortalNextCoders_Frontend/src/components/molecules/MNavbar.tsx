import {
  Button,
  Link,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import { useMatch, useNavigate, useResolvedPath } from "react-router";

interface NavlinkProps {
  section: Section
}

export function NavLink({ section }: NavlinkProps) {
  const navigate = useNavigate();
  const resolvedPath = useResolvedPath(section.path);
  const match = useMatch({ path: resolvedPath.pathname, end: true });

  const handleClick = () => {
    navigate(section.path);
  };

  return (
    <List component="nav">
      <ListItemButton
        disableRipple
        selected={!!match}
        onClick={section.modal? section.onClick :handleClick}
        sx={{
          bgcolor: match ? "transparent" : "transparent",
          "&:hover": { bgcolor: "transparent" },
        }}
      >
        {section.modal ? (
          <Typography    
            sx={{
              color: match ? "#4263EB" : "#9EA6AD",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "14px",
              borderBottom: match ? "3px solid #4263EB" : "",
              pb: 0.5,
            }}
          >
            {section.title}
          </Typography>
        ) : (
          <Link
            href={section.path}
            underline="none"
            sx={{
              color: match ? "#4263EB" : "#9EA6AD",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "14px",
              borderBottom: match ? "3px solid #4263EB" : "",
              pb: 0.5,
            }}
          >
            {section.title}
          </Link>
        )}
    
      </ListItemButton>
    </List>
  );
}



export interface Section {
  path: string;
  title: string;
  modal: boolean;
  onClick?: () => void;
}

interface props {
  sections: Section[]
}

function MNavbar({sections}: props) {

  return (
    <List sx={{ display: "flex", borderBottom: "1px solid #EBF0F3" }}>
      {sections?.map((section: Section, index) => (
        <NavLink key={index} section={section} /> 
      ))}
    </List>
  );
}

export default MNavbar;
