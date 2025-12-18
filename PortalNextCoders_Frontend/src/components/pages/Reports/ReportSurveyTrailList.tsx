import { Box, TextField, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import MLoading from "../../molecules/MLoading";
import { MTableGrid } from "../../molecules/MGrid/MTableGrid";
import { useNavigate } from "react-router";
import { PageHeader } from "../Candidate/styles";
import StudentService from "../../../services/student/student.service";

function ReportSurveyTrailList() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filter, setFilter] = useState("");
    const itemsPerPage = 10;

    const getClass = async () => {
        setIsLoading(true);
        const classData = await StudentService.getActiveClassesGeneral();
        setTotalPages(classData.length);
        const filteredData = classData.filter((item: any) => {
                return item.name.toLowerCase().includes(filter.toLowerCase());
            }
        );
        
        const paginatedData = filteredData.slice(
            page * itemsPerPage,
            page * itemsPerPage + itemsPerPage
        );
        
        setClasses(paginatedData);
        setIsLoading(false);
    };

    useEffect(() => {
        getClass();
    }, [filter, page]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value);
        setPage(0); // Reset the page to 1 when the filter changes
    };

    const handlePaginationClick = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const TABLE_HEAD = [
        {
            title: "Turmas",
            field: "name",
        }
    ];

    const tableRows = classes.map((studentClass) => ({
        id: studentClass.id,
        name: <div>{studentClass.name}</div>
    }));

    const handleTrailClick = (classId: number) => {
        navigate(`/reports/survey/${classId}`);
    };

    return (
        <Box>
            <PageHeader>
                <h1>Pesquisa de Satisfação</h1>
            </PageHeader>
            <TextField
                sx={{ marginBottom: 2 }}
                label="Turma"
                value={filter}
                onChange={handleFilterChange}
            />
            
            {isLoading ? (
                <MLoading/>
            ) : (
                <MTableGrid
                    tableHead={TABLE_HEAD}
                    tableRows={tableRows}
                    rowCallback={handleTrailClick}
                    paginationConfig={{
                        page,
                        totalPages,
                    }}
                    paginationCallback={handlePaginationClick}
                    rowsPerPage={itemsPerPage}
                />
            )}
        </Box>
    );
}

export default ReportSurveyTrailList;