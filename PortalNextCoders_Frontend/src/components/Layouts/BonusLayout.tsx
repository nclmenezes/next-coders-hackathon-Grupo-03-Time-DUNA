import { Outlet } from "react-router";
import { AppBar, Box, Link, Toolbar, Typography } from "@mui/material";
import MCardSection from "../molecules/MCardSection";
import { useStudent } from "../../context/StudentProvider/StudentProvider";
import studentPaymentService from "../../services/api/student/studentPayment.service";
import { useEffect, useState } from "react";
import MNavbar, { NavLink, Section } from "../molecules/MNavbar";
import MLoading from "../molecules/MLoading";
import { PaymentInfoModal, RegisterPeriodsPayment } from "../organisms/OPayments/RegisterPayment";
import { StudentPaymentDto } from "../../interfaces/StudentContents/Responses/Student";
import { useAuth } from "../../context/AuthProvider/useAuth";



function BonusLayout() {
  const [loading, setLoading] = useState(true);
  // const { studentPayment, setStudentPayment } = useStudent();
  // const [currentStudentPayment, setCurrentStudentPayment ] = useState<StudentPaymentDto>();
  const { studentPeriod, getStudentPeriod } = useStudent();
  const { user } = useAuth();
  const [sectionsRoutes, setSectionsRoutes] = useState<Section[]>([]);
  // const [openPayment, setOpenPayment] = useState(false);
  // const [openInfoPayment, setOpenInfoPayment] = useState(false);
  // const [periodId, setPeriodId] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.id) {
          getStudentPeriod(user.id);
        }
        const sectionRoute: Section[] = [
          {
            path: "",
            title: "Bonificação",
            modal: false
          }
        ];
        setSectionsRoutes(sectionRoute);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const getStudentPayment = async () =>{
    setLoading(true);    
    try {
      const payment = await studentPaymentService.GetStudentPayment();
      let paymentCurrent;

      if (payment !== null && Array.isArray(payment)) {
        paymentCurrent = payment.find((paymentItem) => paymentItem.currentPeriod);
      } else {
        paymentCurrent = {
          id: 0,
          studentId: 0,
          studentClassId: 0,
          contractorRewardId: 0,
          monthlyPayment: 0,
          periodReward: 0,
          grade: 0,
          presence: 0,
          classPeriodId: 0,
          periodNumber: 0,
          currentPeriod: true,
          closedPeriod: false,
        };
      }
      
      if (payment !== null && !paymentCurrent) {
        paymentCurrent = payment[0] || null;
      }
      

      const sectionRoute: Section[] = [
        {
          path: "",
          title: "Bonificação",
          modal: false
        },
        // {
        //   path: "/",
        //   title: "Pagamentos",
        //   modal: true,
        //   onClick: () => setOpenPayment(true)
        // },    
        // {
        //   path: `/teamsDetail/${paymentCurrent!.studentId}/${paymentCurrent!.studentClassId}`,
        //   title: "Notas e Presenças",
        //   modal: false
        // },   
      ];  

      setSectionsRoutes(sectionRoute);
      // setStudentPayment(payment);
      // setCurrentStudentPayment(paymentCurrent);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getStudentPayment();
  }, []);   


  // const handlePeriodButtonClick = (period: number) => {
  //   setPeriodId(period);
  //   setOpenInfoPayment(true)
  // };   

  return (
    <>
      <MCardSection title="Gamificação"  description="Verifique qual foi a porcentagem de bônus atingida nesse mês"  />
        {loading? <MLoading/>: (<MNavbar sections={sectionsRoutes} />)}
      <Box>
        <Outlet />
      </Box>

      {/* <RegisterPeriodsPayment 
        open={openPayment} 
        onClose={()=> setOpenPayment(false)} 
        onPeriodButtonClick={handlePeriodButtonClick}/>
      
      <PaymentInfoModal 
          open={openInfoPayment}
          onClose={()=> setOpenInfoPayment(false)}
          studentId={currentStudentPayment?.studentId!}
          periodId={periodId}
          trash={false}
          />       */}
    </>
  );
}

export default BonusLayout;
