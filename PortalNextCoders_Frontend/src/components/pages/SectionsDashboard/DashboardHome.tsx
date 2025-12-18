import { useAuth } from "../../../context/AuthProvider/useAuth";
import { UserRoleEnum } from "../../../enums";
import TDashboardAdmin from "../../templates/TDashboard/TDashboardAdmin";
import TDashboardStudent from "../../templates/TDashboard/TDashboardStudent";
import TDashboardStudentNew from "../../templates/TDashboard/TDashboardStudentNew";

function DashboardHome() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRoleEnum.admin;

  return isAdmin ? <TDashboardAdmin /> : <TDashboardStudentNew/>;
}

export default DashboardHome;
