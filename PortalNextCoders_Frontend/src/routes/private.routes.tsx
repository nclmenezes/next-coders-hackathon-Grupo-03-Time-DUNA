import React, { ReactElement } from "react";
import { UserRoleEnum } from "../enums";
import CandidateDetails from "../components/pages/Candidate/CandidateDetails";
import CandidateList from "../components/pages/Candidate/CandidateList";
import Class from "../components/pages/Class/Class";
import DashboardHome from "../components/pages/SectionsDashboard/DashboardHome";
import MainPages from "../components/pages/MainPages/MainPages";
import Training from "../components/pages/Training/Training";
import TrainingLayout from "../components/Layouts/TrainingLayout";
import Reports from "../components/pages/Reports/Reports";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import GavelIcon from '@mui/icons-material/Gavel';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from "@mui/icons-material/Assessment";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Trophy from '@mui/icons-material/EmojiEvents';
import BonusLayout from "../components/Layouts/BonusLayout";
import Bonus from "../components/pages/Bonus/Bonus";
import SchoolIcon from '@mui/icons-material/School';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import PublicIcon from '@mui/icons-material/Public';
import LaptopIcon from '@mui/icons-material/Laptop';
import Teams from "../components/pages/Teams/Teams";
import TeamDetail from "../components/pages/Teams/TeamDetail";
import TeamMentoring from "../components/pages/Teams/TeamMentoring";
import TeamManagement from "../components/pages/Teams/TeamManagement";
import TeamHandsOnTrails from "../components/pages/Teams/TeamHandsOnTrails";
import TeamHandsOnModules from "../components/pages/Teams/TeamHandsOnModules";
import TeamHandsOnPresence from "../components/pages/Teams/TeamHandsOnPresence";
import TeamCreation from "../components/pages/Teams/TeamCreation";
import LiveContentCreation from "../components/pages/Teams/LiveContentCreation";
import Contractors from "../components/pages/Teams/Contractors";
import ContractorDetail from "../components/pages/Teams/ContractorDetail";
import ContractorCreation from "../components/pages/Teams/ContractorCreation";
import Courses from "../components/pages/Contents/Courses";
import Trails from "../components/pages/Contents/Trails";
import Contents from "../components/pages/Contents/Contents";
import HandsOnCreation from "../components/pages/HandsOn/HandsOnCreation";
import ContractorTeam from "../components/pages/Teams/ContractorTeam";
import StudentTeamDetail from "../components/pages/Teams/StudentTeamDetail";
import LiveContentDetail from "../components/pages/Teams/LiveContentDetail";
import LiveContent from "../components/pages/Teams/LiveContent";
import Maintainers from "../components/pages/Maintainers/Maintainers";
import ControlCalendar from "../components/pages/Calendar/ControlCalendar";
import StudentTeamModuleDetail from "../components/pages/Teams/StudentTeamModuleDetail";
import StudentMentoringPresence from "../components/pages/Teams/StudentMentoringPresence";
import Payments from "../components/pages/Payments/Payments";
import { Payment } from "@mui/icons-material";
import PaymentDetail from "../components/pages/Payments/PaymentDetail";
import StudentPaymentDetail from "../components/pages/Payments/StudentPaymentDetail";
import EditData from "../components/pages/Profile/EditData/EditData";
import FilePresentIcon from '@mui/icons-material/FilePresent';
import Manuals from "../components/pages/Files/Manuals";
import EditProfessionalData from "../components/pages/Profile/EditProfessionalProfile/EditProfessionalData";
import ReportsCandidate from "../components/pages/Reports/ReportsCandidate";
import ReportsSurvey from "../components/pages/Reports/ReportsSurvey";
import ReportSurveyTrailList from "../components/pages/Reports/ReportSurveyTrailList";
import TCandidateExam from "../components/templates/TCandidate/TCandidateExam";
import OCandidateExam from "../components/organisms/OCandidate/OCandidateExam";
import ManagementClass from "../components/pages/Teams/ManagementClass";
import CreateAndEditManagementClass from "../components/pages/Teams/CreateAndEditManagementClass";
import CreateAndEditStudentClass from "../components/pages/Teams/CreateAndEditStudentClass";
import AgentClass from "../components/pages/Teams/AgentClass";
import StudentClass from "../components/pages/Teams/StudentClass";
import AgentManagement from "../components/pages/Teams/AgentManagement";
import EditAgent from "../components/pages/Teams/EditAgent";
import MaintainerManagement from "../components/pages/Teams/MaintainerManagement";
import CreateMaintainer from "../components/pages/Teams/CreateMaintainer";
import EditMaintainer from "../components/pages/Teams/EditMaintainer";
import CreateAndEditManagementClassRewards from "../components/pages/Teams/CreateAndEditManagementClassRewards";
import MoveDownIcon from '@mui/icons-material/MoveDown';
import StudentTransfer from "../components/pages/StudentTransfer/StudentTransfer";
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import OLiveClass from "../components/organisms/OLiveClass/OLiveClass";
import Communication from "../components/pages/Communication/Communication";
import {MCommunicationSender} from "../components/molecules/MCommunication/MCommunicationSender";
import TTeamDetailReport from "../components/templates/TTeams/TTeamDetailReport";
import TTeamDetailReportData from "../components/templates/TTeams/TTeamDetailReportData";
import StudentPeriod from "../components/pages/Teams/PaymentPeriod/StudentPeriod";
import StudentReportLink from "../components/atoms/StudentReportLink/StudentReportLink";

import PeriodDetailPage from "../components/pages/Teams/PaymentPeriod/PeriodDetailPage";
import ExtraCourses from "../components/pages/Contents/ExtraCourses";
import ExtraTrails from "../components/pages/Contents/ExtraTrails";
import ExtraContents from "../components/pages/Contents/ExtraContents";

export interface RouteConfig {
  path?: string;
  element: ReactElement;
  children?: RouteConfig[];

  isIndex?: boolean;
  isAuthenticated?: boolean;
  avoidAthenticated?: true;
  roles?: string[];
  state?: any;
}

const drawerOptions = [
  {
    icon: <HomeIcon />,
    path: "/",
    label: "Início",
    roles: [UserRoleEnum.admin, UserRoleEnum.student],
  },
  {
    icon: <RocketLaunchIcon />,
    path: "/training",
    label: "Formação",
    roles: [UserRoleEnum.student],
  },
  {
    icon: <ListAltIcon />,
    path: "/candidates",
    label: "Candidatos",
    roles: [UserRoleEnum.admin],
  },
  {
    icon: <AssessmentIcon />,
    path: "/reports",
    label: "Relatórios",
    roles: [UserRoleEnum.admin],
  },
  {
    icon: <Trophy />,
    path: "/bonus",
    label: "Gamificação",
    roles: [UserRoleEnum.student],
  },
  {
    icon: <SchoolIcon />,
    path: "/teams",
    label: "Turmas v1",
    roles: [UserRoleEnum.admin],
  },
  {
    icon: <SchoolIcon />,
    path: "/managementClass",
    label: "Turmas v2",
    roles: [UserRoleEnum.admin],
  },
  {
    icon: <Payment />,
    path: "/payments",
    label: "Pagamentos",
    roles: [UserRoleEnum.admin],
  },  
  {
    icon: <Payment />,
    path: "/payments/student",
    label: "Meus Pagamentos",
    roles: [UserRoleEnum.student],
  },  
  {
    icon: <SchoolIcon />,
    path: "/",
    label: "Turmas",
    roles: [UserRoleEnum.company],
  },
  {
    icon: <GavelIcon />,
    path: "/contractors",
    label: "Contratantes v1",
    roles: [UserRoleEnum.admin],
  },
  {
    icon: <GavelIcon />,
    path: "/agents",
    label: "Contratantes v2",
    roles: [UserRoleEnum.admin],
  },
  {
    icon: <AccountBalanceIcon />,
    path: "/maintainers",
    label: "Mantenedores v1",
    roles: [UserRoleEnum.admin],
  },  
  {
    icon: <AccountBalanceIcon />,
    path: "/maintainer",
    label: "Mantenedores v2",
    roles: [UserRoleEnum.admin],
  },
  {
    icon: <LiveTvIcon />,
    path: "/live",
    label: "Aula ao vivo",
    roles: [UserRoleEnum.admin],
  },
  {
    icon: <ContentPasteIcon />,
    path: "/courses",
    label: "Criação de conteúdo",
    roles: [UserRoleEnum.admin],
  },
  {
    icon: <PublicIcon />,
    path: "/extraCourses",
    label: "Cursos Livres",
    roles: [UserRoleEnum.admin],
  },
  {
    icon: <LaptopIcon />,
    path: "/handsOn/creation",
    label: "Hands-On",
    roles: [UserRoleEnum.admin],
  },
  {
    icon: <MailOutlineIcon />,
    path: "/communication",
    label: "Comunicação",
    roles: [UserRoleEnum.admin],
  },
  {
    icon: <CalendarMonthIcon />,
    path: "/calendar/:id",
    label: "Calendário",
    roles: [UserRoleEnum.student],
  },
  {
    icon: <LaptopChromebookIcon />,
    path: "/liveclass",
    label: "Aula ao vivo",
    roles: [UserRoleEnum.student],
  },
  {
    icon: <FilePresentIcon />,
    path: "/manuals",
    label: "Manuais e documentos",
    roles: [UserRoleEnum.student],
  },
  {
    icon: <AssessmentIcon />, 
    element: <StudentReportLink />,
    label: "",
    roles: [UserRoleEnum.student],
  }, 
  {
    icon: <MoveDownIcon />,
    path: "/transfer",
    label: "Transferências",
    roles: [UserRoleEnum.admin],
  }
];

export { drawerOptions };

export const privateRoutes: RouteConfig[] = [
  {
    path: "/",
    element: <MainPages drawerOptions={drawerOptions} />,
    isAuthenticated: true,
    children: [
      {
        isIndex: true,
        element: <DashboardHome />,
        isAuthenticated: true,
        roles: [UserRoleEnum.admin, UserRoleEnum.student]
      },
      {
        path: "/calendar/:id",
        element: <ControlCalendar />,
        isAuthenticated: true,
      },
      {
        path: "/candidates",
        element: <CandidateList />,
        isAuthenticated: true,
        roles: [UserRoleEnum.admin]
      },
      {
        path: "/candidates/detail/:id",
        element: <CandidateDetails />,
        isAuthenticated: true,
      },
      {
        path: "/live",
        element: <LiveContent />,
        isAuthenticated: true,
      },
      {
        path: "/live/detail/:id",
        element: <LiveContentDetail />,
        isAuthenticated: true,
      },
      {
        path: "/live/creation",
        element: <LiveContentCreation />,
        isAuthenticated: true,
      },
      {
        path: "/",
        element: <ContractorTeam />,
        isAuthenticated: true,
      }, 
      {
        path: "/teams/:studentId/:studentTeamId/:moduleId",
        element: <StudentTeamDetail />,
        isAuthenticated: true,
      },
      {
        path: "/teamsDetail/:studentId/:studentTeamId",
        element: <StudentTeamModuleDetail />,
        isAuthenticated: true,
      },
      {
        path: "/teamsDetail/:studentId/:studentTeamId/mentoring",
        element: <StudentMentoringPresence />,
        isAuthenticated: true,
      },
      {
        path: "/teams",
        element: <Teams />,
        isAuthenticated: true,
      },
      {
        path: "/agents",
        element: <AgentManagement />,
        isAuthenticated: true,
      },
      {
        path: "/agents/create",
        element: <EditAgent />,
        isAuthenticated: true,
      },
      {
        path: "/agents/:agentId/edit",
        element: <EditAgent />,
        isAuthenticated: true,
      },
      {
        path: "/maintainer",
        element: <MaintainerManagement />,
        isAuthenticated: true,
      },
      {
        path: "/maintainer/create",
        element: <CreateMaintainer />,
        isAuthenticated: true,
      },
      {
        path: "/maintainer/:agentId/edit",
        element: <EditMaintainer />,
        isAuthenticated: true,
      },
      {
        path: "/managementClass",
        element: <ManagementClass />,
        isAuthenticated: true,
      },
      {
        path: "/managementClass/create",
        element: <CreateAndEditManagementClass />,
        isAuthenticated: true,
      },
      {
        path: "/managementClass/:studentClassManagementId/edit",
        element: <CreateAndEditManagementClass />,
        isAuthenticated: true,
      },
      {
        path: "/managementClass/:studentClassManagementId/rewards",
        element: <CreateAndEditManagementClassRewards />,
        isAuthenticated: true,
      },
      {
        path: "/managementClass/:studentClassManagementId",
        element: <AgentClass />,
        isAuthenticated: true,
      },
      {
        path: "/managementClass/:studentClassManagementId/pagamentos",
        element: <StudentPeriod />,
        isAuthenticated: true,
      },
      {
        path: "/managementClass/:studentClassManagementId/pagamentos/:periodId",
        element: <PeriodDetailPage />,
        isAuthenticated: true,
      },
      {
        path: "/managementClass/:studentClassManagementId/create",
        element: <CreateAndEditStudentClass />,
        isAuthenticated: true,
      },
      {
        path: "/managementClass/:studentClassManagementId/:studentClassId",
        element: <StudentClass />,
        isAuthenticated: true,
      },
      {
        path: "/managementClass/:studentClassManagementId/:studentClassId/edit",
        element: <CreateAndEditStudentClass />,
        isAuthenticated: true,
      },
      {
        path: "/payments",
        element: <Payments />,
        isAuthenticated: true,
      },
      {
        path: "/payments/detail/:id",
        element: <PaymentDetail />,
        isAuthenticated: true,
      },      
      {
        path: "/payments/student/:studentId/class/:classId",
        element: <StudentPaymentDetail />,
        isAuthenticated: true,
      },
      {
        path: "/teams/detail/:id",
        element: <TeamDetail />,
        isAuthenticated: true,
      },
      {
        path: "/teams/mentoring/:classId/presence",
        element: <TeamMentoring />,
        isAuthenticated: true,
      },
      {
        path: "/teams/management/:id",
        element: <TeamManagement />,
        isAuthenticated: true,
      },
      {
        path: "/teams/handsOn/:classId/trails",
        element: <TeamHandsOnTrails />,
        isAuthenticated: true,
      },
      {
        path: "/teams/handsOn/:classId/modules",
        element: <TeamHandsOnModules />,
        isAuthenticated: true,
      },
      {
        path: "/teams/handsOn/presence/:contentId",
        element: <TeamHandsOnPresence />,
        isAuthenticated: true,
      },
      {
        path: "/teams/creation",
        element: <TeamCreation />,
        isAuthenticated: true,
      },
      {
        path: "/courses",
        element: <Courses />,
        isAuthenticated: true,
      },   
      {
        path: "/courses/:id",
        element: <Trails />,
        isAuthenticated: true
      },   
      {
        path: "/courses/:id/content/:subModuleId",
        element: <Contents />,
        isAuthenticated: true
      }, 
      {
        path: "/extraCourses",
        element: <ExtraCourses />,
        isAuthenticated: true,
      },   
      {
        path: "/extraCourses/:id",
        element: <ExtraTrails />,
        isAuthenticated: true
      },   
      {
        path: "/extraCourses/:id/content/:subModuleId",
        element: <ExtraContents />,
        isAuthenticated: true
      },
      {
        path: "/handsOn/creation",
        element: <HandsOnCreation />,
        isAuthenticated: true
      },
      {
        path: "/communication",
        element: <Communication />,
        isAuthenticated: true
      }, 
      {
        path: "/communicationEngine",
        element: <MCommunicationSender />,
        isAuthenticated: true,
        state: { selectedEmails: [] }
      },
      {
        path: "/contractors",
        element: <Contractors />,
        isAuthenticated: true,
      },
      {
        path: "/contractors/detail/:contractorId",
        element: <ContractorDetail />,
        isAuthenticated: true,
      },
      {
        path: "/contractors/creation",
        element: <ContractorCreation />,
        isAuthenticated: true,
      },
      {
        path: "/maintainers",
        element: <Maintainers />,
        isAuthenticated: true,
      },    
      {
        path: "/reports",
        element: <Reports />,
        isAuthenticated: true,
      },
      {
        path: "/reports/candidates",
        element: <ReportsCandidate />,
        isAuthenticated: true,
      },
      {
        path: "/reports/survey",
        element: <ReportSurveyTrailList />,
        isAuthenticated: true,
      },
      {
        path: "/reports/assessments",
        element: <TTeamDetailReport />,
        isAuthenticated: true,
      }, 
      {
        path: "/reports/assessments/:id",
        element: <TTeamDetailReportData />,
        isAuthenticated: true,
      },
      {
        path: "/reports/survey/:id",
        element: <ReportsSurvey />,
        isAuthenticated: true,
      },
      {
        path: "/manuals",
        element: <Manuals />,
        isAuthenticated: true,
      },
      {
        path: "/liveclass",
        element: <OLiveClass />,
        isAuthenticated: true,
      },
      {
        path: "/training",
        element: <TrainingLayout />,
        isAuthenticated: true,
        children: [
          {
            isIndex: true,
            element: <Training />,
            isAuthenticated: true,
          },
        ],
      },
      {
        path: "/training/courseExtra/:courseExtraId",
        element: <TrainingLayout />,
        isAuthenticated: true,
        children: [
          {
            isIndex: true,
            element: <Training />,
            isAuthenticated: true,
          },
        ],
      },
      {
        path: "/training/extra/:subModuleId",
        element: <Class />,
        isAuthenticated: true
      },
      {
        path: "/training/:subModuleId",
        element: <Class />,
        isAuthenticated: true
      },
      {
        path: "/bonus",
        element: <BonusLayout />,
        isAuthenticated: true,
        children: [
          {
            isIndex: true,
            element: <Bonus />,
            isAuthenticated: true,
          },
        ],
      },
      {
        path: "/profile/edit-data",
        element: <EditData />,
        isAuthenticated: true
      },
      {
        path: "/profile/edit-professional-data",
        element: <EditProfessionalData />,
        isAuthenticated: true
      },
      {
        path: "/profile/aptitude-test",
        element: <TCandidateExam />,
        isAuthenticated: true
      },
      {
        path: "/profile/aptitude-test/student",
        element: <OCandidateExam />,
        isAuthenticated: true
      },
      {
        path: "/transfer",
        element: <StudentTransfer />,
        isAuthenticated: true
      }
    ],
  },
];
