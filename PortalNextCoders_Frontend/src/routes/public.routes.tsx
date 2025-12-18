import ConfirmRecoveryEmail from "../components/pages/ConfirmRecoveryEmail";
import LoginPortal from "../components/pages/LoginPortal";
import UserAccountRecover from "../components/pages/User/UserAccountRecover";
import UserAutoSignIn from "../components/pages/User/UserAutoSignIn";
import UserResetPassword from "../components/pages/User/UserResetPassword";
import CertificatePublicView from "../components/pages/CertificatePublicView";

import { RouteConfig } from "../interfaces/routes/routes.interfaces";

export const publicRoutes: RouteConfig[] = [
  {
    path: "/login",
    element: <LoginPortal />,
    avoidAuthenticated: true,
  },
  {
    path: "/recover",
    element: <UserAccountRecover />,
    avoidAuthenticated: true,
  },
  {
    path: "/reset/:email/:token",
    element: <UserResetPassword />,
    avoidAuthenticated: true,
  },
  {
    path: "/confirm-recovery-email",
    element: <ConfirmRecoveryEmail />,
    avoidAuthenticated: true,
  },
  {
    path: "/auto-signin",
    element: <UserAutoSignIn />,
    avoidAuthenticated: true,
  },
  {
    path: "/certificate/:certificateId",
    element: <CertificatePublicView />,
  },
];