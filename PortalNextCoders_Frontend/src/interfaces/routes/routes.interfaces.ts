import { ReactElement } from "react";

export interface RouteConfig {
  path?: string;
  element: ReactElement;
  children?: RouteConfig[];
  
  isIndex?: boolean;
  isAuthenticated?: boolean;
  avoidAuthenticated?: true;
  roles?: string[];
}
