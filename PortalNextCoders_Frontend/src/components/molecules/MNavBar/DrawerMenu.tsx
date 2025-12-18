import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useAuth } from '../../../context/AuthProvider/useAuth';
import { useStudent } from '../../../context/StudentProvider/StudentProvider';
import { UserRoleEnum } from '../../../enums';
import { drawerOptions } from '../../../routes/private.routes';
import { useNavigate } from 'react-router-dom';

interface DrawerOption {
    icon: React.ReactNode;
    path?: string;
    element?: React.ReactNode;
    label: string;
    roles: string[];
}

const DrawerMenu = () => {
    const auth = useAuth();
    const { classes: studentClasses } = useStudent();
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        navigate(path);
    }

    return (
        <List>
            {drawerOptions.map((option: DrawerOption, index: number) => {
                const { icon, path, label, roles } = option;

                if (roles && auth.user?.role && roles.includes(auth.user.role)) {
                    let finalPath = path || '/';
                    if (label === 'Pagamentos' && auth.user?.role === UserRoleEnum.student) {
                        finalPath = `/payments/student/${auth.user?.id}/class/${studentClasses?.id}`;
                    }
                    return (
                        <ListItem key={`drawer-${label}-${index}`} disablePadding>
                            <ListItemButton onClick={() => handleNavigate(finalPath)}>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={label} />
                            </ListItemButton>
                        </ListItem>
                    );
                }
            })}
        </List>
    );
}

export default DrawerMenu;
