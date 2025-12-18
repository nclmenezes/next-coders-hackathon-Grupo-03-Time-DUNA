import {useEffect, useState} from "react";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import {Box} from "@mui/material";
import {useParams} from "react-router-dom";
import studentService from "../../../services/student/student.service";
import {useNavigate} from "react-router";
import MLoadingReport from "../../molecules/MLoadingReport";

function TTeamDetailReportData() {
    {
        const {id} = useParams<string>();
        const navigate = useNavigate();
        const [students, setStudents] = useState<any[]>([]);
        const [isLoading, setIsLoading] = useState(false);
        const [getReport, setGetReport] = useState(false);
        const [_, setTotalStudents] = useState(0);
        const [columns, setColumns] = useState<any[]>([]);
        const [rows, setRows] = useState<any[]>([]);

        const getStudents = async () => {
            setIsLoading(true);
            const studentClassId = parseInt(id ?? '0', 10);
            const profilesData = await studentService.GetStudentClassDetailReport(studentClassId);

            setIsLoading(false);
            setStudents(profilesData.results[0]?.classStudents || []);
            setTotalStudents(profilesData.totalRecords)
            setColumns(profilesData.results.map((profile: any) =>
                profile.classStudents.map((student: any) => student.studentName)
            ).flat());
            const uniqueModules = new Set(profilesData.results[0]?.classStudents[0]?.modules.map((module: any) => module.moduleName));
            setRows(Array.from(uniqueModules));
        };
        useEffect(() => {
            const fetchData = async () => {
                await getStudents();
            }

            fetchData();
        }, []);

        useEffect(() => {
            const exportReport = async () => {
                if (rows.length > 0 && columns.length > 0 && students.length > 0) {
                    await exportToCSV("Relatório de Alunos");
                }
            };

            exportReport();
        }, [rows, columns, students]);
        const exportToCSV = async (fileName: any) => {
            setGetReport(!getReport);
            const fileType =
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const fileExtension = ".xlsx";

            // Map the students data to fill the grades for each student
            const formatedExcelData = rows.map((moduleName: string) => {
                const row: any = {"Tema do módulo": moduleName};
                students.forEach((student) => {
                    if (student.modules) {
                        const module = student.modules.find((mod: any) => mod.moduleName === moduleName);
                        row[student.studentName] = module ? module.subModuleGrade.toFixed(1).replace('.', ',') : "";
                    } else {
                        console.warn(`No modules found for student: ${student.studentName}`);
                    }
                });
                return row;
            });

            const ws = XLSX.utils.json_to_sheet(formatedExcelData);
            /* custom headers */
            XLSX.utils.sheet_add_aoa(ws, [["Tema do módulo", ...columns]], {origin: "A1"});

            const wb = {Sheets: {data: ws}, SheetNames: ["data"]};
            const excelBuffer = XLSX.write(wb, {bookType: "xlsx", type: "array"});
            const data = new Blob([excelBuffer], {type: fileType});
            FileSaver.saveAs(data, fileName + fileExtension);
            navigate('/reports/assessments');
        };

        return (
            <Box>
                {isLoading ? (
                    <MLoadingReport/>
                ) : (
                    <>
                    </>
                )
                }
            </Box>
        );
    }
}

export default TTeamDetailReportData;