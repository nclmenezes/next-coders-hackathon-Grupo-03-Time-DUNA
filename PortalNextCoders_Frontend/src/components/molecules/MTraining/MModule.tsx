import React from "react";
import { ReactNode, useState } from "react";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import {
  useMediaQuery,
  useTheme,
  styled,
  Link,
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
  Typography,
  Paper,
  Chip,
} from "@mui/material";

interface props {
  title: string;
  lessons: string;
  hours: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

function Module({ title, hours, lessons, children }: props) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: theme.shadows[2],
        },
        background: open 
          ? `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}15 100%)`
          : theme.palette.background.paper,
      }}
    >
      <ListItemButton
        disableRipple
        onClick={handleClick}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 2.5,
          px: 3,
          "&:hover": { 
            bgcolor: open 
              ? `${theme.palette.primary.main}20` 
              : `${theme.palette.action.hover}50` 
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: open 
                ? `${theme.palette.primary.main}25` 
                : `${theme.palette.primary.main}10`,
              transition: 'all 0.2s ease',
            }}
          >
            {open ? (
              <FolderOpenIcon sx={{ color: theme.palette.primary.main }} />
            ) : (
              <FolderIcon sx={{ color: theme.palette.primary.main }} />
            )}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: open ? theme.palette.primary.main : theme.palette.text.primary,
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: '1rem',
                mb: 0.5,
                transition: 'color 0.2s ease',
              }}
            >
              {title}
            </Typography>
            
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: 'wrap' }}>
              <Chip
                label={lessons}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  height: 24,
                  color: open ? theme.palette.primary.main : theme.palette.text.secondary,
                  borderColor: open ? theme.palette.primary.main : theme.palette.text.secondary,
                }}
              />
              
              <Chip
                label={hours}
                size="small"
                variant="filled"
                sx={{
                  fontSize: '0.75rem',
                  height: 24,
                  backgroundColor: open 
                    ? theme.palette.primary.main 
                    : theme.palette.action.selected,
                  color: open ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {open ? (
            <ExpandLess 
              sx={{ 
                color: theme.palette.primary.main,
                transition: 'transform 0.2s ease',
              }} 
            />
          ) : (
            <ExpandMore 
              sx={{ 
                color: theme.palette.text.secondary,
                transition: 'transform 0.2s ease',
              }} 
            />
          )}
        </Box>
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ p: 3, pt: 0 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              pl: 1,
            }}
          >
            {children}
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}

export default Module;
