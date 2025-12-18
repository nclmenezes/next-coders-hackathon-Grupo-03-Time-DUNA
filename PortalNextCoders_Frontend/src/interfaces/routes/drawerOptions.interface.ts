import { ReactNode } from "react";

interface isDrawerOptions {
    icon: ReactNode;
    label: string;
    path?: string;
    roles?: string[];
    element?: ReactNode;
};
  
export interface prop {
    drawerOptions: isDrawerOptions[];
};
