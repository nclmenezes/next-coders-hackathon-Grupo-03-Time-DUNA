import { v4 as uuidv4 } from "uuid";
import {
    Box,
    Stack,
    Table,
    TableBody,
    IconButton,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Checkbox
} from "@mui/material";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { makeStyles } from "@mui/styles";
import { StyledTableRow } from "./styles";

const useStyles = makeStyles({
    cell: {
        padding: "6px", // Adjust the padding as needed
    },
});

export const MCheckBoxTableGrid = ({
                                       tableHead,
                                       tableRows,
                                       rowCallback,
                                       handleCandidateClick,
                                       paginationConfig,
                                       paginationCallback,
                                       rowsPerPage = 10,
                                       handleSelectAll,
                                       selectedEmails
                                   }: any) => {
    const classes = useStyles();

    return (
        <Box>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {tableHead.map((item: any) => (
                            <TableCell
                                key={item.field}
                                sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}
                            >
                                {item.field === "select" ? (
                                    <Checkbox
                                        indeterminate={selectedEmails.size > 0 && selectedEmails.size < tableRows.length}
                                        checked={selectedEmails.size === tableRows.length}
                                        onChange={handleSelectAll}
                                    />
                                ) : (
                                    item.title
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {tableRows.map((itemRow: any) => (
                        <StyledTableRow
                            key={uuidv4()}
                            onClick={() => rowCallback(itemRow.id)}
                        >
                            {tableHead.map((itemCol: any) => {
                                const isDetailsCol = itemCol.field === "details";
                                return (
                                    <TableCell
                                        key={uuidv4()}
                                        sx={{ minWidth: itemCol.minWidth || undefined }}
                                    >
                                        {itemRow[itemCol.field]}
                                        {isDetailsCol && (
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleCandidateClick(itemRow.id)}
                                            >
                                                <FindInPageIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                );
                            })}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>

            <Stack alignItems="center">
                <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={paginationConfig.totalPages}
                    rowsPerPage={rowsPerPage}
                    page={paginationConfig.page}
                    onPageChange={paginationCallback}
                />
            </Stack>
        </Box>
    );
};