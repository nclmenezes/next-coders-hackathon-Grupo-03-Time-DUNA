import * as React from 'react';
import { ReactNode, useState } from "react";
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import {useMediaQuery, useTheme, styled, Link, Box, Drawer, CssBaseline, Toolbar, List, IconButton,ListItemButton, ListItemIcon, ListItemText, Divider, Typography} from '@mui/material';

interface props {
  title: string;
  title2: string;
  numberModule: string;
  hours: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Module({ title, title2, children, hours, numberModule}: props) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box >
      <ListItemButton disableRipple  onClick={handleClick} sx={{display: 'flex', borderBottom: '1px solid #EBF0F3', '&:hover': { bgcolor: 'transparent' }, }}>
        <Box sx={{border: '4px solid #DDE2E5', borderRadius: '100%', p: 1.5, px: 1.5}}>
          <p style={{color: '#212429', fontFamily: 'Inter', fontWeight: 600}}>{numberModule}</p>
        </Box>

        <Box sx={{display: 'block', pl:2, width: {lg: '88.8%', xl: '91%'} }}>
          <ListItemText primary={title}  sx={{fontSize: '16px', color: '#212429', fontFamily: 'Inter', fontWeight: 'bold'}} />
          <ListItemText primary={title2} sx={{fontSize: '14px', color: '#495057', fontFamily: 'Inter', fontWeight: 400}} />
        </Box>

        <Typography sx={{pr: 2, fontFamily: 'Inter', color: '#495057', fontSize: '14px', fontWeight: 400, width: '100px'}}>{hours}</Typography>

          {open ? <ExpandLess color='primary' /> : <ExpandMore color='primary' />}
      </ListItemButton>
  
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children}
        </List>
      </Collapse>
    </Box>

  )
}