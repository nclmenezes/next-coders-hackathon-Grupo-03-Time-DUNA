import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@mui/styles";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import FindInPage from "@mui/icons-material/FindInPage";

import CandidateService from "../../../services/candidate.service";
import { CandidateInterface } from "../../../interfaces/candidate.interface";
import MLoading from "../../molecules/MLoading";
import { showErrorToast } from "../../../utils/toast";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  oddRow: {
    backgroundColor: "#F8F9FA",
  },
  activeStatusButton: {
    borderRadius: "20px",
    backgroundColor: "#4caf50",
    color: "white",
    fontWeight: "bold",
    padding: "8px 16px",
    cursor: "default",
  },
  inactiveStatusButton: {
    borderRadius: "20px",
    backgroundColor: "#9e9e9e",
    color: "white",
    fontWeight: "bold",
    padding: "8px 16px",
    cursor: "default",
  },
});

const OCandidatesList = () => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [candidateList, setCandidateData] = useState<CandidateInterface[]>([]);
  const [candidateListLoaded, setCandidateListLoaded] = useState(false);

  const rowsPerPage = 20;
  const startingIndex = (page - 1) * rowsPerPage;
  const candidatesToShow = candidateList.slice(
    startingIndex,
    startingIndex + rowsPerPage
  );
  
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <Box>
      {candidateListLoaded ? (
        <Box>
          <Typography variant="h5" padding={"40px"}>
            Listagem de candidatos
          </Typography>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="candidates table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>Nome</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Sobrenome
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Apelido</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Etapa</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidatesToShow.length > 0 ? (
                  candidatesToShow.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={index % 2 === 0 ? "" : classes.oddRow}
                    >
                      <TableCell>{row.firstName}</TableCell>
                      <TableCell>{row.lastName}</TableCell>
                      <TableCell>{row.nickname}</TableCell>
                      <TableCell>
                        {row.status > 0 ? (
                          <Button
                            sx={{
                              float: "center",
                              bgcolor: "#67A10F",
                              color: "white",
                            }}
                          >
                            Ativo
                          </Button>
                        ) : (
                          <Button
                            sx={{
                              float: "center",
                              bgcolor: "#9EA6AD",
                              color: "white",
                            }}
                          >
                            Inativo
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          sx={{
                            float: "center",
                            bgcolor: "#9EA6AD",
                            color: "white",
                          }}
                        >
                          VESTIBULAR FINALIZADO
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Link to={`/candidates/detail/${row.id}`}>
                          <FindInPage style={{ color: "#0A5995" }} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Não existe nenhum candidato pendente de aprovação.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Stack spacing={20}>
              <Pagination
                style={{ padding: "20px" }}
                count={Math.ceil(candidateList.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
              />
            </Stack>
          </div>
        </Box>
      ) : (
        <MLoading />
      )}
    </Box>
  );
};

export default OCandidatesList;
