import React from "react";
import { Typography, MenuItem } from '@mui/material';

import { useAuth } from "../../context/AuthProvider/useAuth";

interface LogoutProps {
    navigate: any;
};

export const LogoutButton: React.FC<LogoutProps> = ({ navigate }) => {
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <MenuItem>
      <Typography textAlign="center" onClick={handleLogout}>
        Logout
      </Typography>
    </MenuItem>
  );
};
