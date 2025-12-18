import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { PageHeader } from "../Candidate/styles";
import MLoading from "../../molecules/MLoading";
import { MTableGrid } from "../../molecules/MGrid/MTableGrid";
import agentsService from "../../../services/Teams/agents.service";
import { AgentDto, AgentTypes } from "../../../interfaces/teams/class.interfaces";
import { showErrorToast } from "../../../utils/toast";

function AgentManagement() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [contractors, setContractors] = useState<AgentDto[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [agents, setAgents] = useState<AgentDto[]>([]);

    const getContractors = async () => {
        setIsLoading(true);
        const _agentsQuery = await agentsService.GetAgents(0, 10);
        if (!_agentsQuery) return showErrorToast("Erro ao recuperar agentes");
        const _agentsData = _agentsQuery.data.filter(el => el.agentType && el.agentType.id === AgentTypes.Contractor);
        setAgents(_agentsData);

        setContractors(_agentsData);
        setTotalPages(_agentsQuery.totalPages);
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
        id: contractor.id,
        contractorId: <div>{contractor.id}</div>,
        name: <div>{contractor.name}</div>,
        documentNumber: <div>{contractor.documentNumber}</div>
    }));

    const handlePaginationClick = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleContractorClick = (contractorId: number) => {
        navigate(`/agents/${contractorId}/edit`, {state: {agent: agents.find(el => el.id === contractorId)}});
    };
    const createContractor = () => {
        navigate(`/agents/create`);
    };

    return (
        <>
            {isLoading && <MLoading />}
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
        </>
    );
}

export default AgentManagement;