import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useState, useRef } from "react";
import { Box, Grid, Link } from "@mui/material";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import CertificateLayout from "../../Layouts/CertificateLayout";
import MLoading from "../../molecules/MLoading/index";
import TeamsService from "../../../services/Teams/teams.service";
import StudentService from "../../../services/student/student.service";
import ClassDocumentsService from "../../../services/api/classes/documents.service";
import certificateService from '../../../services/student/certificate.service';
import { ICertificateDetails, ICertificateDto } from '../../../interfaces/certificate.interface'
import linkedinBanner from "../../../assets/linkedin-banner.png";
import { showErrorToast } from "../../../utils/toast";
import TrailService from "../../../services/api/classes/trail.service";
import CheckStudentClass from "../../../services/student/checkStudentClass.service";
import { IStudentClassCheckDto } from '../../../interfaces/student/checkStudentClass.interface';
import AgentClassesService from "../../../services/Teams/classes/agentClasses.service";
import PdfViewer from './PdfViewer';

const stateDictionary: { [key: string]: string } = {
    "AC": "Acre",
    "AL": "Alagoas",
    "AP": "Amapá",
    "AM": "Amazonas",
    "BA": "Bahia",
    "CE": "Ceará",
    "DF": "Distrito Federal",
    "ES": "Espírito Santo",
    "GO": "Goiás",
    "MA": "Maranhão",
    "MT": "Mato Grosso",
    "MS": "Mato Grosso do Sul",
    "MG": "Minas Gerais",
    "PA": "Pará",
    "PB": "Paraíba",
    "PR": "Paraná",
    "PE": "Pernambuco",
    "PI": "Piauí",
    "RJ": "Rio de Janeiro",
    "RN": "Rio Grande do Norte",
    "RS": "Rio Grande do Sul",
    "RO": "Rondônia",
    "RR": "Roraima",
    "SC": "Santa Catarina",
    "SP": "São Paulo",
    "SE": "Sergipe",
    "TO": "Tocantins",
};

type CertificateStep = 0 | 1 | 2;
const CONTAINER_URL = "https://nextcodersfiles.blob.core.windows.net/documents";
const CERTIFICATE_BLOB_URL = "https://nextcodersfiles.blob.core.windows.net/certificate/";
const CERTIFICATE_URL = "https://aluno.nextcoders.com.br/certificate/";
let CERTIFICATE_ID = "";

const Manuals = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [linkedinUrl, setLinkedinUrl] = useState<string>("");
    const [isOpenManual, setIsOpenManual] = useState<boolean>(false);
    const [documentUrl, setDocumentUrl] = useState<string>('');
    const [certificateStep, setCertificateStep] = useState<CertificateStep | undefined>(undefined);
    const [isCertificateGenerated, setIsCertificateGenerated] = useState<boolean>(false);
    const [certificateUrl, setCertificateUrl] = useState<string>("");
    const [certificateDetails, setCertificateDetails] = useState<ICertificateDetails | undefined>(undefined);
    const certificateRef = useRef(null);

    const [optionsDocument, setOptionsDocument] = useState<any>([
        {
            label: 'Política de proteção de dados',
            func: () => openDocument('/TERMOS_DE_USO_-_UTILIZADO (1).pdf'),
            visibility: () => true,
            disabled: () => false
        },
        {
            label: 'Manual do aluno',
            func: () => openDocument('/Manual_do_aluno.pdf'),
            visibility: () => true,
            disabled: () => false
        },
        {
            label: 'Gerar certificado de conclusão de curso',
            func: () => setIsCertificateGenerated(true),
            visibility: () => !certificateStep,
            disabled: () => certificateStep === undefined
        },
        {
            label: 'Gerando certificado de conclusão de curso, aguarde alguns instantes!',
            func: () => { },
            visibility: () => certificateStep === 1,
            disabled: () => certificateStep === undefined
        },
        {
            label: 'Acessar certificado de conclusão de curso',
            func: () => accessCertificate(),
            visibility: () => certificateStep === 2,
            disabled: () => certificateStep === undefined
        }
    ]);
    
    const openDocument = (url: string) => {
        setDocumentUrl(CONTAINER_URL + url);
        setIsOpenManual(true);
    };

    const accessCertificate = () => {
        setDocumentUrl(CERTIFICATE_BLOB_URL + CERTIFICATE_ID);
        setIsOpenManual(true);
    };

    const onClose = () => setIsOpenManual(false);

    const isPastCertificateIssue= (endClass: string) => {
        const endClassDate = new Date(endClass + "-03:00");
        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
        today.setHours(0, 0, 0, 0);
        return endClassDate < today;
    };

    const createLinkedinUrl = (certificateInfo: ICertificateDto) => {
        const { courseName, issueDate, certificateId, url } = certificateInfo;
        setCertificateUrl(`${url}/${certificateId}`);
        CERTIFICATE_ID = certificateId;
        setLinkedinUrl(
            `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${courseName}` +
            '&organizationId=86775972' +
            `&issueYear=${issueDate.split("-")[0]}` +
            `&issueMonth=${issueDate.split("-")[1]}` +
            `&certUrl=${CERTIFICATE_URL + certificateId}`
        );
    };

    const resetCertificateStep = () => {
        setIsCertificateGenerated(false);
        setCertificateStep(0);
        setIsLoading(false);
    };

    const getClassFiles = async (classId: number) => {
        try {
            const response = await ClassDocumentsService.GetDocumentsByStudentClassId(classId);
            if (!response) return;

            setOptionsDocument((prevState: any) => {
                const newOptions = [...prevState];
                response.documents.forEach((file) => {
                    const existingIndex = newOptions.findIndex(
                        (option: { label: string }) => option.label.trim().toLowerCase() === file.documentName.trim().toLowerCase()
                    );
                    if (existingIndex !== -1) {
                        newOptions[existingIndex] = {
                            label: file.documentName,
                            func: () => openDocument('/' + file.documentFileName),
                            visibility: () => true,
                            disabled: () => false
                        };
                    } else {
                        newOptions.push({
                            label: file.documentName,
                            func: () => openDocument('/' + file.documentFileName),
                            visibility: () => true,
                            disabled: () => false
                        });
                    }
                });
                return newOptions;
            });

        } catch (error) {
            console.error('Erro ao buscar arquivos da turma:', error);
        }
    }
    const handleErrorResponse = (errorMessage: string): void => {
        showErrorToast(errorMessage);
        setIsLoading(false);
    };

    const getUserCertificate = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            const studentClass = await StudentService.GetClassByStudentId(user.id);
            await getClassFiles(studentClass.studentClassId);
            if (!studentClass) return handleErrorResponse("Não foi possível obter os dados da turma!");
            if (!isPastCertificateIssue(studentClass.certificateIssueDate)) return setIsLoading(false);

            const certificateResponse: ICertificateDto | null = await certificateService.getCertificateByStudentId(user.id);
            if (certificateResponse) {
                createLinkedinUrl(certificateResponse);
                setCertificateStep(2);
                return setIsLoading(false);
            };

            const studentGrades = await TeamsService.getStudentByTeamId(studentClass.studentClassId, user.id)
            if (!studentGrades) return handleErrorResponse("Não foi possível obter a trilha da turma!");
            if (studentGrades.results[0].attendance < 70 || studentGrades.results[0].grade < 7) return setIsLoading(false);

            const trailResponse = await TrailService.GetAllByCourse(studentClass.trailid);
            if (trailResponse.length === 0) return resetCertificateStep();
            
            setCertificateDetails({
                courseName: trailResponse[0].courseName,
                issueDate: studentClass.certificateIssueDate,
                contractorName: studentClass.certificateSponsor,
                signatureLocation: stateDictionary[studentClass.state]
            });

            return resetCertificateStep();
        } catch (error) {
            resetCertificateStep();
        };
    };

    const getUserCertificateNewEndpoint = async (checkStudentClass: IStudentClassCheckDto) => {
        if (!user?.id) return;
        setIsLoading(true);

        const { contractorManagement } = checkStudentClass;
        if (!contractorManagement) return;

        try {
            const studentClass = await AgentClassesService.GetAgentClassById(contractorManagement.studentClassId);
            if (!studentClass) return handleErrorResponse("Não foi possível obter os dados da turma!");
            if (!isPastCertificateIssue(studentClass.studentClassCertificate.issueAt)) return setIsLoading(false);

            const certificateResponse: ICertificateDto | null = await certificateService.getCertificateByStudentId(user.id);
            if (certificateResponse) {
                createLinkedinUrl(certificateResponse);
                setCertificateStep(2);
                return setIsLoading(false);
            };

            const studentGrades = await TeamsService.getStudentByTeamId(checkStudentClass.studentClassReferenceId, user.id)
            if (!studentGrades) return handleErrorResponse("Não foi possível obter a trilha da turma!");

            if (studentGrades.results[0].classStudents[0].studentAttendance < 70 || studentGrades.results[0].classStudents[0].studentGrade < 7) return setIsLoading(false);

            const trailResponse = await TrailService.GetAllByCourse(studentClass.courseId);
            if (trailResponse.length === 0) return resetCertificateStep();
            
            setCertificateDetails({
                courseName: trailResponse[0].courseName,
                issueDate: studentClass.studentClassCertificate.issueAt,
                contractorName: studentClass.studentClassCertificate.sponsor,
                signatureLocation: stateDictionary[studentClass.studentClassCoverages[0].state]
            });
            
            return resetCertificateStep();
        } catch (error) {
            resetCertificateStep();
        };
    };

    const fetchCertificate = async () => {
        if (!user?.id) return;

        setIsLoading(true);
        const checkStudentClass: IStudentClassCheckDto | null = await CheckStudentClass(user.id);
        if (!checkStudentClass) return handleErrorResponse("Não foi possível obter os dados do aluno!");
        setIsLoading(false);
        if (!checkStudentClass.contractorManagement) return getUserCertificate();

        await getUserCertificateNewEndpoint(checkStudentClass);
        await getClassFiles(checkStudentClass.studentClassReferenceId);
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchCertificate();
        };

        fetchData().catch((error) => {
            console.error('Erro ao buscar certificado:', error);
            setIsLoading(false);
        } );
    }, []);

    useEffect(() => {
        setOptionsDocument((prevState: any) => {
            const newOptions = [...prevState];
            newOptions.forEach(option => {
                if (option.label === 'Gerar certificado de conclusão de curso') {
                    option.visibility = () => !certificateStep;
                    option.disabled = () => certificateStep === undefined;
                } else if (option.label === 'Gerando certificado de conclusão de curso, aguarde alguns instantes!') {
                    option.visibility = () => certificateStep === 1;
                    option.disabled = () => certificateStep === undefined;
                } else if (option.label === 'Acessar certificado de conclusão de curso') {
                    option.visibility = () => certificateStep === 2;
                    option.disabled = () => certificateStep === undefined;
                }
            });
            return newOptions;
        });
    }, [certificateStep]);
    const generateCertificate = async () => {
        if (!certificateRef.current) return;

        const canvas = await html2canvas(certificateRef.current, { scale: 1 });
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [canvas.width, canvas.height],
        });

        const imgData = canvas.toDataURL('image/png');

        const imgProp = 1.407;
        const imgWidth = canvas.width * imgProp;
        const imgHeight = canvas.height * imgProp;

        const xPosition = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
        const yPosition = (pdf.internal.pageSize.getHeight() - imgHeight) / 2;

        pdf.addImage(imgData, 'PNG', xPosition, yPosition, imgWidth, imgHeight);

        return pdf.output('blob');
    };

    const certificateRegister = async () => {
        setCertificateStep(1);

        try {
            const blob = await generateCertificate();
            if (!blob || !certificateDetails?.issueDate || !user?.id) return resetCertificateStep();
            const certificateFile = new File([blob], 'certificado.pdf');

            const formData = new FormData();
            formData.append('CertificateFile', certificateFile);
            formData.append('CourseName', certificateDetails.courseName);
            formData.append('StudentId', `${user.id}`);
            formData.append('IssueDate', certificateDetails.issueDate);

            const certificateResponse: ICertificateDto | null = await certificateService.createUserCertificate(formData);

            if (!certificateResponse) return resetCertificateStep();

            createLinkedinUrl(certificateResponse);

            setCertificateStep(2);
        } catch (error) {
            resetCertificateStep();
        }
    };
    
    useEffect(() => {
        const registerCertificate = async () => {
            await certificateRegister();
        };

        if (isCertificateGenerated) {
            registerCertificate().catch((error) => {
                console.error('Erro ao gerar certificado:', error);
                resetCertificateStep();
            });
        }
    }, [isCertificateGenerated]);

    return (
        <Box>
            {isLoading ? (
                <MLoading />
            ) : (
                    <>
                    <PdfViewer file={documentUrl} visible={isOpenManual} onClose={onClose}/>

                    <Grid container direction="row" justifyContent="center" alignItems="center">
                        {
                            [...optionsDocument]
                                .sort((a, b) => a.label.localeCompare(b.label))
                                .map((option, index) =>
                                    option.visibility() && (
                                        <Grid item xs={12} key={index}>
                                            <Link
                                                component="button"
                                                variant="body2"
                                                onClick={!option.disabled() ? option.func : undefined}
                                                color="primary"
                                                type="button"
                                                style={{
                                                    color: option.disabled() ? 'grey' : '',
                                                    textDecoration: option.disabled() ? 'underline grey' : '',
                                                    cursor: option.disabled() ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                {option.label}
                                            </Link>
                                        </Grid>
                                    )
                                )
                        }
                    </Grid>

                    <Box mt={2} display="flex" flexDirection="column" sx={{ cursor: !linkedinUrl ? 'not-allowed' : 'pointer', width: "188px" }}>
                        <Link
                            href={!!linkedinUrl ? linkedinUrl : undefined}
                            target="_blank"
                            style={{
                                marginTop: '1vh',
                                pointerEvents: !linkedinUrl ? 'none' : 'auto',
                                filter: !linkedinUrl ? 'grayscale(120%)' : 'none',
                            }}
                        >
                            <img
                                src={linkedinBanner}
                                alt="Adicionar certificado no LinkedIn"
                                style={{ width: "auto", cursor: 'pointer' }}
                            />
                        </Link>
                    </Box>
                </>
            )}
            {
                certificateStep === 0 &&
                <div
                    ref={certificateRef}
                    style={{
                        position: 'absolute',
                        left: '-10000px',
                        top: 0,
                        height: '1190px',
                        width: '1768px',
                        overflow: 'hidden',
                        zIndex: '-10000'
                    }}
                >
                    {
                        user &&
                        <CertificateLayout
                            userInfo={user}
                            certificateDetails={certificateDetails}
                        />
                    }
                </div>
            }
        </Box>

    )
};

export default Manuals;
