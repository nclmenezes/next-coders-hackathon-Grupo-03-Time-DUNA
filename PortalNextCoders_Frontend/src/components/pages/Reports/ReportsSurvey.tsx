import {
    Box, Button
} from "@mui/material";
import {useEffect, useState} from "react";
import MLoading from "../../molecules/MLoading";
import {MTableGrid} from "../../molecules/MGrid/MTableGrid";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import {useParams} from "react-router-dom";
import studentService from "../../../services/student/student.service";
import {useNavigate} from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function ReportsSurvey() {
    const {id} = useParams<string>();
    const navigate = useNavigate();
    const [trail, setTrail] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [getReport, setGetReport] = useState(false);
    const [totalTrailData, setTotalTrailData] = useState(0);
    const [excelData, setExcelData] = useState<any[]>([]);
    const [excelFilterData, setExcelFilterData] = useState<any[]>([]);

    const getTrailData = async () => {
        setIsLoading(true);
        const studentClassData = await studentService.GetSurveyResponsePerTrail(parseInt(id ?? '0'));
        const trailData = await studentService.GetStudentClassTrails(parseInt(id ?? '0'));
        setTrail(trailData);
        setTotalTrailData(studentClassData.totalRecords)
        const fullStudentClassData = await studentService.GetSurveyResponsePerTrail(parseInt(id ?? '0'), 1, studentClassData.totalPages * studentClassData.totalRecords);
        setTotalTrailData(fullStudentClassData.totalRecords)
        setExcelData(fullStudentClassData.results)
        setIsLoading(false);
    };

    const handleTrailClick = async (trailId: number) => {
        setIsLoading(true);
        const response = await studentService.GetSurveyResponsePerTrail(parseInt(id ?? '0'), 1, totalTrailData, trailId);
        setExcelFilterData(response.results)
        await exportFilterToCSV("next-coders-satisfaction-report")
        setIsLoading(false);
    };


    useEffect(() => {
        const fetchData = async () => {
            await getTrailData();
        }

        fetchData();
    }, []);

    const TABLE_HEAD = [
        {
            title: "Módulo",
            field: "trailName",
        }
    ];
    const tableRows = trail.map((data) => ({
        id: data.trailId,
        trailName: `Exportar módulo: ${data.trailName}`
    }));
    const exportToCSV = async (fileName: any) => {
        setGetReport(!getReport);
        const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const formatedExcelData = excelData.map((data) => ({
            name: `${data.firstName} ${data.lastName}`,
            socialName: data.socialName,
            studentClassName: data.studentClassName,
            trailName: data.trailName,
            question: data.question,
            answered: data.answered ? (data.answered ? "Sim" : "Não") : "Não",
            response: data.response
        }));
        const ws = XLSX.utils.json_to_sheet(formatedExcelData);
        /* custom headers */
        XLSX.utils.sheet_add_aoa(ws, [["Nome", "Nome Social", "Turma","Módulo","Questão", "Respondido", "Resposta"]], {origin: "A1"});

        const wb = {Sheets: {data: ws}, SheetNames: ["data"]};
        const excelBuffer = XLSX.write(wb, {bookType: "xlsx", type: "array"});
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const exportFilterToCSV = async (fileName: any) => {
        setGetReport(!getReport);
        const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const formatedExcelData = excelFilterData.map((data) => ({
            name: `${data.firstName} ${data.lastName}`,
            socialName: data.socialName,
            studentClassName: data.studentClassName,
            trailName: data.trailName,
            question: data.question,
            answered: data.answered ? (data.answered ? "Sim" : "Não") : "Não",
            response: data.response
        }));
        const ws = XLSX.utils.json_to_sheet(formatedExcelData);
        /* custom headers */
        XLSX.utils.sheet_add_aoa(ws, [["Nome", "Nome Social", "Turma", "Módulo", "Questão", "Respondido", "Resposta"]], {origin: "A1"});

        const wb = {Sheets: {data: ws}, SheetNames: ["data"]};
        const excelBuffer = XLSX.write(wb, {bookType: "xlsx", type: "array"});
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const handlePaginationClick = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleBackClick = () => {
        navigate('/reports/survey');
    }

    return (
        <Box>
            {isLoading ? (
                <MLoading/>
            ) : (
                <Box>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon fontSize="small"/>}
                        sx={{minWidth: 50, bgcolor: "#4263EB", margin: 1, width: '10%'}}
                        onClick={handleBackClick}
                    >
                        Voltar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{minWidth: 100, bgcolor: "#679d12", margin: 1, width: '10%'}}
                        onClick={async () => {
                            await exportToCSV("next-coders-satisfaction-report")
                        }}
                    >
                        Exportar Relatório Geral
                    </Button>
                    <MTableGrid
                        tableHead={TABLE_HEAD}
                        tableRows={tableRows}
                        paginationConfig={{
                            page,
                            totalPages: totalTrailData,
                        }}
                        rowCallback={handleTrailClick}
                        paginationCallback={handlePaginationClick}
                    />
                </Box>
            )
            }
        </Box>
    );
}

export default ReportsSurvey;
