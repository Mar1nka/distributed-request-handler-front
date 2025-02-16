import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  CircularProgress
} from '@mui/material';
import { Resource } from "../App.tsx";
import * as React from "react";

type ResourcesTableProps = {
  resources: Resource[];
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
};

export default function ResourcesTable ({resources, page, pageSize, total, loading, setPage, setPageSize, }: ResourcesTableProps) {

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangePageSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      {loading ? (
        <div style={{textAlign: 'center', padding: '20px'}}>
          <CircularProgress/>
        </div>
      ) : (
        <Table sx={{minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Url</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>HTTP code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell>{resource.id}</TableCell>
                <TableCell>{resource.url}</TableCell>
                <TableCell>{resource.status}</TableCell>
                <TableCell>{resource.httpCode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={total}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangePageSize}
      />
    </TableContainer>
  );
};