import { v4 as uuidv4 } from "uuid";
import { format, isValid, parseISO } from "date-fns";

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
} from "@mui/material";

import FindInPageIcon from "@mui/icons-material/FindInPage";
import { makeStyles } from "@mui/styles";

import { StyledTableRow } from "./styles";

const useStyles = makeStyles({
  cell: {
    padding: "6px",
  },
});

interface TableHeadItem {
  field: string;
  title: string;
  minWidth?: number;
}

interface PaginationConfig {
  page: number;
  totalPages: number;
}

interface MTableGridProps {
  tableHead?: TableHeadItem[];
  tableRows?: any[];
  rowCallback?: (id: any) => void;
  handleCandidateClick?: (id: any) => void;
  paginationConfig?: PaginationConfig;
  paginationCallback?: (event: unknown, newPage: number) => void;
  rowsPerPage?: number;
}

export const MTableGrid = ({
  tableHead = [],
  tableRows = [],
  rowCallback,
  handleCandidateClick,
  paginationConfig = { page: 0, totalPages: 0 },
  paginationCallback,
  rowsPerPage = 10,
}: MTableGridProps) => {
  const classes = useStyles();

  // Early return if no data
  if (!tableHead?.length && !tableRows?.length) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        Nenhum dado para exibir
      </Box>
    );
  }

  return (
    <Box>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {(tableHead || []).map((item: TableHeadItem) => (
              <TableCell
                key={item.field}
                sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}
              >
                {item.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {(tableRows || []).map((itemRow: any) => (
            <StyledTableRow
              key={uuidv4()}
              onClick={() => rowCallback?.(itemRow.id)}
            >
              {(tableHead || []).map((itemCol: TableHeadItem) => {
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCandidateClick?.(itemRow.id);
                        }}
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
          count={paginationConfig?.totalPages || 0}
          rowsPerPage={rowsPerPage}
          page={paginationConfig?.page || 0}
          onPageChange={paginationCallback || (() => {})}
        />
      </Stack>
    </Box>
  );
};
