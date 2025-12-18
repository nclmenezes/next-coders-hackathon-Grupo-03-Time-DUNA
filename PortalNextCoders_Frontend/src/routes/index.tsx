import { Navigate, Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { routes } from "./routes";
import { RouteConfig } from "../interfaces/routes/routes.interfaces";
import { useAuth } from "../context/AuthProvider/useAuth";

export const Router = () => {
  const { isAuthenticated, user } = useAuth();

  const validateRoute = (route: RouteConfig) => {
    if (route.avoidAuthenticated && isAuthenticated) {
      return {
        isAllowed: false,
        redirect: "/",
      };
    }

    if (route.isAuthenticated && !isAuthenticated) {
      return {
        isAllowed: false,
        redirect: "/login",
      };
    }
    
    if (
      user?.role &&
      route.roles?.length &&
      !route.roles?.includes(user.role)
    ) {
      return {
        isAllowed: false,
        redirect: "/",
      };
    }

    return {
      isAllowed: true,
    };
  };

  const renderRedirectRoute = (route: RouteConfig, redirectTo?: string) => {
    if (!redirectTo) return;

    return (
      <Route
        key={uuidv4()}
        path={route.path}
        element={<Navigate to={redirectTo} />}
      />
    );
  };

  const renderRoute = (route: RouteConfig) => {
    const validatedRoute = validateRoute(route);
  
    if (!validatedRoute.isAllowed) {
      return renderRedirectRoute(route, validatedRoute.redirect);
    }

    return (
      <Route
        key={uuidv4()}
        {...(route.isIndex && { index: true })}
        {...(route.path && { path: route.path })}
        element={route.element}
      >
        {route.children?.map((childRoute) => {
          const validatedChildRoute = validateRoute(childRoute);

          if (!validatedChildRoute.isAllowed) {
            return renderRedirectRoute(
              childRoute,
              validatedChildRoute.redirect
            );
          }

          return renderRoute(childRoute);
        })}
      </Route>
    );
  };

  return (
    <Routes>
      {routes.map((route) => {
        return renderRoute(route);
      })}
    </Routes>
  );
};
