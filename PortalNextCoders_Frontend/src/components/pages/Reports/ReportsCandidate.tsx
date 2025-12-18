import {
    Box, Button,
    Chip
} from "@mui/material";
import {useEffect, useState} from "react";
import candidateService from "../../../services/candidate.service";
import MLoading from "../../molecules/MLoading";
import {MTableGrid} from "../../molecules/MGrid/MTableGrid";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import {format} from 'date-fns';

function ReportsCandidate() {
    {
        const [candidates, setCandidates] = useState<any[]>([]);
        const [isLoading, setIsLoading] = useState(false);

        const [page, setPage] = useState(0);
        const [getReport, setGetReport] = useState(false);
        const [totalCandidates, setTotalCandidates] = useState(0);
        const [excelData, setExcelData] = useState<any[]>([]);

        const getCandidates = async () => {
            setIsLoading(true);
            const profilesData = await candidateService.getProfilesForReports({
                page: page + 1
            });

            setIsLoading(false);
            setCandidates(profilesData);
            setTotalCandidates(profilesData[0].totalRecords)
        };

        const getExportData = async () => {
            const excelData = await candidateService.getExportData();

            setExcelData(excelData);
        };

        useEffect(() => {
            const fetchData = async () => {
                await getCandidates();
            }

            fetchData();
        }, []);

        useEffect(() => {
            getCandidates();
        }, [page]);

        useEffect(() => {
            const fetchData = async () => {
                await getExportData();
            }

            fetchData();
        }, [getReport]);

        const TABLE_HEAD = [
            {
                title: "Nome",
                field: "name",
            },
            {
                title: "Nome Social",
                field: "socialName",
            },
            {
                title: "Documento",
                field: "cpf",
            },
            {
                title: "Nota",
                field: "surveyScore",
            },
            {
                title: "Email",
                field: "email",
            },
            {
                title: "Localidade",
                field: "location",
            },
            {
                title: "Situação",
                field: "processStatus",
            },
            {
                title: "WhatsApp",
                field: "whatsApp",
            },
            {
                title: "Idade",
                field: "birthDate",
            },
            {
                title: "Exame iniciado em",
                field: "surveyDate",
            },
            {
                title: "Exame finalizado em",
                field: "surveyEndDate",
            },
            {
                title: "Genêro",
                field: "gender",
            },
            {
                title: "Nivel de educação",
                field: "educationLevel",
            },
            {
                title: "Criado em",
                field: "createdAt",
            },
        ];

        const defineJourneyType = (journeyType: string): string => {
            if (journeyType === 'Moorning') {
                return 'Manhã';
            }
            if (journeyType === 'Afternoon') {
                return 'Tarde';
            }
            if (journeyType === 'Night') {
                return 'Noite';
            }
            if (journeyType === 'Fulltime') {
                return 'Integral';
            }

            return 'Não possui';
        }
        const defineMaritalStatus = (maritalStatus: string): string => {
            if (maritalStatus === 'Single') {
                return 'Solteiro(a)';
            }
            if (maritalStatus === 'Married') {
                return 'Casado(a)';
            }
            if (maritalStatus === 'StableUnion') {
                return 'União estável';
            }
            if (maritalStatus === 'Divorced') {
                return 'Divorciado(a)';
            }
            if (maritalStatus === 'Widowed') {
                return 'Viúvo(a)';
            }
            return 'Não especificado';
        }

        const defineEthnicGroup = (ethnicGroup: string): string => {
            if (ethnicGroup === 'White') {
                return 'Branco';
            }

            if (ethnicGroup === 'Mixed') {
                return 'Pardo';
            }

            if (ethnicGroup === 'Black') {
                return 'Preto';
            }

            return 'Não especificado';
        }

        const calculateAge = (birthday: Date, today: Date): number => {
            const birthDate = new Date(birthday);
            const currentDate = new Date(today);

            let age = currentDate.getFullYear() - birthDate.getFullYear();

            // Check if the birthday hasn't occurred yet this year
            const hasBirthdayPassed = (currentDate.getMonth() > birthDate.getMonth())
                || (currentDate.getMonth() === birthDate.getMonth()
                    && currentDate.getDate() >= birthDate.getDate());

            if (!hasBirthdayPassed) {
                age--;
            }

            return age;
        };

        const calculateScore = (score: number, finishedDate: string | null): number => {
            if (score === undefined && finishedDate !== undefined) {
                return 0;
            }
            return score;
        }
        const exportToCSV = async (fileName: any) => {
            setGetReport(!getReport);
            const fileType =
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const fileExtension = ".xlsx";
            const formatedExcelData = excelData.map((candidate) => ({
                name: candidate.name,
                socialName: candidate.socialName,
                gender: candidate.gender,
                age: calculateAge(new Date(candidate.birthDate), new Date()),
                birthDate: candidate.birthDate ? format(new Date(candidate.birthDate), 'dd/MM/yyyy') : "",
                cpf: candidate.cpf,
                rg: candidate.rg,
                email: candidate.email,
                whatsApp: candidate.whatsApp,
                ethnicGroup: candidate.ethnicGroup ? defineEthnicGroup(candidate.ethnicGroup) : "",
                maritalStatus: candidate.maritalStatus ? defineMaritalStatus(candidate.maritalStatus) : "",
                disabilityGroup: candidate.disabilityGroup ? candidate.disabilityGroup : "",
                createdAt: candidate.createdAt ? format(new Date(candidate.createdAt), 'dd/MM/yyyy HH:mm:ss') : "",
                processStatus: candidate.processStatus,
                surveyDate: candidate.surveyDate ? format(new Date(candidate.surveyDate), 'dd/MM/yyyy HH:mm:ss') : "",
                surveyEndDate: candidate.surveyEndDate ? format(new Date(candidate.surveyEndDate), 'dd/MM/yyyy HH:mm:ss') : "",
                surveyScore: calculateScore(candidate.surveyScore, candidate.surveyEndDate),
                educationLevel: candidate.educationLevel,
                study: candidate.study ? (candidate.study ? "Sim" : "Não") : "",
                course: candidate.course ? candidate.course : "",
                school: candidate.school ? candidate.school : "",
                semester: candidate.semester ? candidate.semester : "",
                work: candidate?.work !== undefined ? (candidate.work ? "Sim" : "Não") : "",
                hasFormalEmployment: candidate.hasFormalEmployment ? (candidate.hasFormalEmployment ? "Sim" : "Não") : "",
                journey: candidate.journey ? defineJourneyType(candidate.journey) : "",
                individualIncome: candidate.individualIncome ? candidate.individualIncome : "",
                familyIncome: candidate.familyIncome ? candidate.familyIncome : "",
                computer: candidate.computer ? "Sim" : "Não",
                internet: candidate.internet ? "Sim" : "Não",
                country: candidate.country ? candidate.country : "",
                locationState: candidate.locationState,
                location: candidate.location,
                street: candidate.street ? candidate.street : "",
                number: candidate.number ? candidate.number : "",
                zipCode: candidate.zipCode ? candidate.zipCode : "",
                neighborhood: candidate.neighborhood ? candidate.neighborhood : "",
                complement: candidate.complement ? candidate.complement : "",
                availability: candidate.availability ? (candidate.availability ? "Sim" : "Não") : "",
                recognize: candidate.recognize ? candidate.recognize : "",
                campaign: candidate.campaign ? candidate.campaign : "",
                issuingAuthority: candidate.issuingAuthority ? candidate.issuingAuthority : "",
                motherName: candidate.motherName ? candidate.motherName : "",
                hasSingleRegistry: candidate.hasSingleRegistry ? (candidate.hasSingleRegistry ? "Sim" : "Não") : ""
            }));
            const ws = XLSX.utils.json_to_sheet(formatedExcelData);
            /* custom headers */
            XLSX.utils.sheet_add_aoa(ws, [["Nome", "Nome Social", "Gênero", "Idade", "Data Nascimento", "CPF", "RG", "Email", "WhatsApp", "Etnia", "Estado Civil",  "Deficiência", "Criado em", "Status", "Exame iniciado em", "Exame finalizado em", "Nota", "Escolaridade", "Estuda?", "Curso", "Instituição", "Semestre", "Trabalha", "Carteira Assinada", "Período", "Renda", "Renda Familiar", "Possui Computador?", "Possui Internet?", "País", "Estado", "Cidade",  "Rua", "Número", "CEP", "Bairro", "Complemento", "Disponibilidade", "Como Conheceu a Next Coders", "Campanha", "Orgão expedidor", "Nome da mãe", "Possui Cad único?"]], {origin: "A1"});

            const wb = {Sheets: {data: ws}, SheetNames: ["data"]};
            const excelBuffer = XLSX.write(wb, {bookType: "xlsx", type: "array"});
            const data = new Blob([excelBuffer], {type: fileType});
            FileSaver.saveAs(data, fileName + fileExtension);
        };

        const tableRows = candidates.map((candidate) => ({
            name: candidate.name,
            socialName: candidate.socialName,
            cpf: <div>{candidate.cpf}</div>,
            surveyScore: (
                <div style={{textAlign: "center", fontWeight: "bold"}}>
                    {calculateScore(candidate.surveyScore, candidate.surveyEndDate)}
                </div>
            ),
            email: <div>{candidate.email}</div>,
            location: <div>{`${candidate.location} - ${candidate.locationState}`}</div>,
            whatsApp: <div>{candidate.whatsApp}</div>,
            birthDate: <div>{calculateAge(new Date(candidate.birthDate), new Date())}</div>,
            surveyDate:
                <div>{candidate.surveyDate ? format(new Date(candidate.surveyDate), 'dd/MM/yyyy HH:mm:ss') : ""}</div>,
            surveyEndDate:
                <div>{candidate.surveyEndDate ? format(new Date(candidate.surveyEndDate), 'dd/MM/yyyy HH:mm:ss') : ""}</div>,
            gender: <div>{candidate.gender}</div>,
            educationLevel: <div>{candidate.educationLevel}</div>,
            processStatus: (
                <Chip
                    label={candidate.processStatus}
                    variant="outlined"
                    sx={{minWidth: 65}}
                />
            ),
            createdAt: <div>{format(new Date(candidate.createdAt), 'dd/MM/yyyy HH:mm:ss')}</div>,
        }));
        const handlePaginationClick = (_: unknown, newPage: number) => {
            setPage(newPage);
        };


        return (
            <Box>
                {isLoading ? (
                    <MLoading/>
                ) : (
                    <Box>
                        <Button
                            variant="contained"
                            sx={{minWidth: 100, bgcolor: "#679d12", margin: 1, width: '10%'}}
                            onClick={async () => {
                                await exportToCSV("next-coders-report")
                            }}
                        >
                            Exportar Relatório
                        </Button>
                        <MTableGrid
                            tableHead={TABLE_HEAD}
                            tableRows={tableRows}
                            paginationConfig={{
                                page,
                                totalPages: totalCandidates,
                            }}
                            paginationCallback={handlePaginationClick}
                        />
                    </Box>
                )
                }
            </Box>
        );
    }
}

export default ReportsCandidate;
