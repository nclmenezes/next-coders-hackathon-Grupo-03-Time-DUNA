import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {Box, Button, FormControl, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import {PageHeader} from "../../pages/Candidate/styles";
import MLoading from "../../molecules/MLoading";
import {MTableGrid} from "../../molecules/MGrid/MTableGrid";
import contractorService from "../../../services/Teams/contractor.service";

function TContractor() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [contractors, setContractors] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const getContractors = async () => {
        setIsLoading(true);
        const profilesData = await contractorService.getAllContractors();

        setContractors(profilesData.results);
        setTotalPages(profilesData.totalPages);
        setIsLoading(false);
    };

    useEffect(() => {
        getContractors();
    }, []);


    const TABLE_HEAD = [
        {
            title: "Contratante",
            field: "contractorId",
        },
        {
            title: "Nome",
            field: "name",
        },
        {
            title: "Cnpj",
            field: "documentNumber",
        }
    ];


    const tableRows = contractors.map((contractor) => ({
        id: contractor.contractorId,
        contractorId: <div>{contractor.contractorId}</div>,
        name: <div>{contractor.name}</div>,
        documentNumber: <div>{contractor.documentNumber}</div>
    }));

    const handlePaginationClick = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleContractorClick = (contractorId: number) => {
        navigate(`/contractors/detail/${contractorId}`);
    };
    const createContractor = () => {
        navigate(`/contractors/creation`);
    };

    return (
        <Box>
            <PageHeader>
                <h1>Contratantes</h1>
            </PageHeader>
            <Button
                variant="contained"
                sx={{ minWidth: 160, marginBottom: 2}}
                onClick={createContractor}
            >
                Novo contratante
            </Button>
                <MTableGrid
                    tableHead={TABLE_HEAD}
                    tableRows={tableRows}
                    rowCallback={handleContractorClick}
                    paginationConfig={{
                        page,
                        totalPages,
                    }}
                    paginationCallback={handlePaginationClick}
                />
        </Box>
    );
}

export default TContractor;