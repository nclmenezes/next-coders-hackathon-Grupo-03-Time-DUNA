import { ReactNode, useEffect, useState } from "react";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import OSatisfaction from "../../organisms/OSatisfaction/OSatisfaction";
import satisfactionService, { CheckStudentResponses } from "../../../services/api/student/satisfaction.service";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface props {
  trailId: number;
  studentId: number;
  title: string;
  title2: string;
  numberModule: string;
  hours: string;
  children: ReactNode;
  defaultOpen?: boolean;
  concluidedPercent: number;
}

export function Trail({ trailId, studentId
  , title
  , title2
  , children
  , hours
  , concluidedPercent
 }: props) {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [ checkStudentResponsesCurrent, setCheckStudentResponsesCurrent] = useState<CheckStudentResponses>();

  const handleClick = () => {
    setOpen(!open);
  };

  const handleModalOpen = (event: React.MouseEvent) => {
    event.stopPropagation();
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const findCheckStudentResponses = async () => {
    try {
      const checkStudentResponses = await satisfactionService.getStudentResponses([trailId], studentId);
      setCheckStudentResponsesCurrent(checkStudentResponses[0]);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    findCheckStudentResponses();
  }, []);

  return (
    <Box>
      <ListItemButton
        disableRipple
        onClick={handleClick}
        sx={{
          display: "flex",
          borderBottom: "1px solid #EBF0F3",
          "&:hover": { bgcolor: "transparent" },
        }}
      >
      <Box sx={{ display: "block", pl: 2, width: "88.8%" }}>
        <ListItemText
          primary={title}
          sx={{
            fontSize: "16px",
            color: "#212429",
            fontFamily: "Inter",
            fontWeight: "bold",
          }}
        />
        <ListItemText
          primary={title2}
          sx={{
            fontSize: "14px",
            color: "#495057",
            fontFamily: "Inter",
            fontWeight: 400,
          }}
        />
      </Box>        
        <Typography
          sx={{
            pr: 2,
            fontFamily: "Inter",
            color: "#495057",
            fontSize: "14px",
            fontWeight: 400,
            width: "100px",
          }}
        >
          {hours}
        </Typography> 
        {open ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
        <Tooltip title="Pesquisa de Satisfação">


          <IconButton disabled={checkStudentResponsesCurrent?.answered || concluidedPercent <100} onClick={handleModalOpen}>
            {
              checkStudentResponsesCurrent?.answered? 
                <StarIcon style={{ color: '#ffcc00' }} /> : <StarBorderIcon style={{ color: '#ffcc00' }} />            }
          </IconButton>
        </Tooltip>        
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children}
        </List>
      </Collapse>

      <OSatisfaction 
        open={modalOpen} 
        onClose={handleModalClose} 
        trailId={trailId} 
        studentId={studentId}/>
    </Box>
  );
}