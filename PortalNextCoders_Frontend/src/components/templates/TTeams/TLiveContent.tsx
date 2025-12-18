import {useNavigate} from "react-router";
import {useEffect, useState} from "react";

import {Box, Button} from "@mui/material";
import {PageHeader} from "../../pages/Candidate/styles";
import MLoading from "../../molecules/MLoading";
import {MTableGrid} from "../../molecules/MGrid/MTableGrid";
import studentService from "../../../services/student/student.service";

function TLiveContent() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [contents, setContents] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(5);


    const getContents = async () => {
        setIsLoading(true);
        const liveClassData = await studentService.GetClassAllLive();
        const contractorData = await studentService.getActiveContractors();
        const studentClassData = await studentService.getActiveClassesGeneral();
        liveClassData.map((liveClass: any) => { 
            liveClass.studentClasName = studentClassData.find((studentClass: any) => studentClass.id === liveClass.studentClassId)?.description;
            liveClass.contractorId = studentClassData.find((studentClass: any) => studentClass.id === liveClass.studentClassId)?.contractorId;
        });
        liveClassData.map((liveClass: any) => {
            liveClass.contractorName = contractorData.find((contractor: any) => contractor.contractorId === liveClass.contractorId)?.name;
        });
        setContents(liveClassData);
        setIsLoading(false);
    };
    

    useEffect(() => {
        getContents();
    }, []);

    const handlePaginationClick = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const TABLE_HEAD = [
        {
            title: "Nome",
            field: "name",
        },
        {
            title: "Descrição",
            field: "description",
        },
        {
            title: "Link",
            field: "link",
        },
        {
            title: "Turma",
            field: "studentClasName",
        },
        {
            title: "Contratante",
            field: "contractorName",
        }
        
    ];


    const tableRows = contents.map((content) => ({
        id: content.contentId,
        name: <div>{content.name}</div>,
        description: <div>{content.description}</div>,
        link: <div>{content.link}</div>,
        studentClasName: <div>{content.studentClasName}</div>,
        contractorName: <div>{content.contractorName}</div>,
    }));


    const handleCandidateClick = (id: number) => {
        navigate(`/live/detail/${id}`);
    };
    
    const createContent = () => {
        navigate(`/live/creation`);
    };

    return (
        <Box>
            <PageHeader>
                <h1>Aulas ao vivo</h1>
            </PageHeader>

            {isLoading ? (
                <MLoading />
            ) : (
                <Box>
                    <Button
                        variant="contained"
                        sx={{ minWidth: 160, marginBottom: 2}}
                        onClick={createContent}
                    >
                       Nova Aula ao vivo
                    </Button>
                    <MTableGrid
                        tableHead={TABLE_HEAD}
                        tableRows={tableRows}
                        rowCallback={handleCandidateClick}
                        paginationConfig={{
                            page,
                            totalPages,
                        }}
                        paginationCallback={handlePaginationClick}
                    />
                </Box>
            )}
        </Box>
    );
}

export default TLiveContent;