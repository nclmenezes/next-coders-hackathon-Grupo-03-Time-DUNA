import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {Box, Button, Paper, Table
    , TableBody, TableCell, TableContainer
    , TableHead, TablePagination, TableRow} from "@mui/material";
import MLoading from "../../molecules/MLoading";
import maintainersService, { IMaintainer, IMaintainersReturn } from "../../../services/api/maintainers/maintainers.service";
import { MCreationMaintainer } from "../../molecules/MMaintainers/MCreationMaintainer";
import MUpdateMaintainer from "../../molecules/MMaintainers/MUpdateMaintainer";

interface ITableRows {
  id: number;
  maintainerId: JSX.Element;
  name: JSX.Element;
  documentNumber: JSX.Element;
}

function TMaintainers() {
    const navigate = useNavigate();
    const [isLoadingCreation, setIsLoadingCreation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [maintainerResult, setMaintainerResult] = useState<IMaintainersReturn | null>(null);
    const [tableRows, setTableRows] = useState<ITableRows[]>([]);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedMaintainer, setSelectedMaintainer] = useState<IMaintainer | null>(null);    

    const handleAddTableRows = (maintainerReturn: IMaintainersReturn) => {
      if (maintainerReturn?.maintainers) {
        const newTableRows = maintainerReturn.maintainers.map((maintainer) => ({
          id: maintainer.maintainerId,
          maintainerId: <div key={maintainer.maintainerId}>{maintainer.maintainerId}</div>,
          name: <div key={maintainer.maintainerId}>{maintainer.name}</div>,
          documentNumber: <div key={maintainer.maintainerId}>{maintainer.documentNumber}</div>,
        }));

        setTableRows(newTableRows);
      }
    };

    const getMaintainers = async () => {
      setIsLoading(true);
      try {
        const maintainers = await maintainersService.List(page, rowsPerPage);
        setTotalPages(maintainers.totalPages);
        setMaintainerResult(maintainers);
        handleAddTableRows(maintainers);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      getMaintainers();
    }, [page, rowsPerPage]);


    const handlePaginationClick = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage + 1);
    };
  
    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(1);
    };
  
    const handleMaintainerClick = (maintainerId: number) => {
      const searchMaintainer = maintainerResult?.maintainers.find((maintainer) => maintainer.maintainerId === maintainerId);
      if(searchMaintainer !== null && searchMaintainer !== undefined){
        setSelectedMaintainer(searchMaintainer!);
      }
      setIsDetailModalOpen(true);
    };    
  
    const handleLoadingCreationOpen = () => {
      setIsLoadingCreation(true);
    };
  
    const handleLoadingCreationClose = () => {
      setIsLoadingCreation(false);
    }; 

    return (
      <Box>
        <h1 style={{marginBottom:"2rem"}}>Mantenedores</h1>
      <Button
        variant="contained"
        sx={{ minWidth: 160, marginBottom: 2 }}
        onClick={handleLoadingCreationOpen}
      >
        Novo mantenedor
      </Button>

      <MCreationMaintainer
        isModalOpen={isLoadingCreation}
        onClose={handleLoadingCreationClose}
        onFetchMaintainers={getMaintainers}
      />


      {isLoading ? <MLoading/> : (      
     <>
          {selectedMaintainer && (
            <MUpdateMaintainer
              maintainer={selectedMaintainer}
              isModalOpen={isDetailModalOpen}
              onClose={() => {
                setIsDetailModalOpen(false);
                setSelectedMaintainer(null);
              }}
              onFetchMaintainers={getMaintainers}
            />
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}>Mantenedor</TableCell>
                  <TableCell sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}>Nome</TableCell>
                  <TableCell sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}>CNPJ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleMaintainerClick(row.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{row.maintainerId}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.documentNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


        <TablePagination
          component="div"
          count={totalPages * rowsPerPage}
          page={page - 1}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePaginationClick}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </>
      )}

    </Box>
    );
}

export default TMaintainers;
