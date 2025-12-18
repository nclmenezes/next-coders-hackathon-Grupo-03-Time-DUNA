import { privateRoutes } from './private.routes';
import { publicRoutes } from "./public.routes";
import { RouteConfig } from "../interfaces/routes/routes.interfaces";

import Error404 from "../components/pages/404";

export const routes: RouteConfig[] = [
  ...publicRoutes,
  ...privateRoutes,
  {
    path: "*",
    element: <Error404 />,
  },
];