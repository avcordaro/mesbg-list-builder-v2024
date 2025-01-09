import { BookmarkAdd, CancelRounded } from "@mui/icons-material";
import {
  FormHelperText,
  InputAdornment,
  Stack,
  TablePagination,
  TextField,
} from "@mui/material";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { ChangeEvent, MouseEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DatabaseTable } from "./components/DatabaseTable.tsx";
import { rows } from "./data.ts";
import { getComparator, Order } from "./utils/sorting.ts";

export const Database = () => {
  const [filter, setFilter] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const handleRequestSort = (_: MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler =
    (property: string) => (event: MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  const handleChangePage = (_: MouseEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = useMemo(() => {
    return [...rows].filter((row) => {
      if (filter.trim().length === 0) return true;
      return filter
        .split(";")
        .map((criteria) => criteria.toLowerCase().trim())
        .every((criteria) => row.searchString.includes(criteria));
    });
  }, [filter]);

  const visibleRows = useMemo(() => {
    return [...filteredRows]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, filteredRows, page, rowsPerPage]);

  return (
    <Container maxWidth={false} sx={{ p: 2 }}>
      <Typography variant="h4" className="middle-earth" sx={{ mb: 2, mt: 1 }}>
        Profile Database
      </Typography>
      <Stack direction="row" gap={0.5} sx={{ mb: 2 }}>
        <Typography>
          You can add models from this database to your personal{" "}
          <Link to="/collection">collection</Link> of miniatures using the{" "}
          <BookmarkAdd sx={{ verticalAlign: "bottom" }} /> button, and choose to
          receive helpful warnings from the list builder if you exceed the
          models available in your collection.
        </Typography>
      </Stack>
      <Stack
        direction="row"
        gap={1}
        sx={{ mt: 1, mr: 2 }}
        alignItems="center"
        justifyContent="space-between"
      >
        <TextField
          id="database-filter-input"
          label="Filter"
          placeholder="Start typing to filter"
          size="small"
          value={filter}
          sx={{
            maxWidth: "80ch",
          }}
          fullWidth
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFilter(event.target.value);
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear filters"
                    onClick={() => setFilter("")}
                    edge="end"
                    sx={{
                      display: filter.length > 0 ? "inherit" : "none",
                    }}
                  >
                    <CancelRounded />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Typography sx={{ whiteSpace: "nowrap", ml: 1 }}>
          <strong>{filteredRows.length} profiles</strong>
        </Typography>
      </Stack>
      <FormHelperText sx={{ mb: 2 }}>
        You can combine filters using semicolons - for example: &quot;Gondor;
        Strike&quot; or &quot;The Free Peoples; Resistant to Magic&quot;
      </FormHelperText>

      <DatabaseTable
        order={order}
        orderBy={orderBy}
        createSortHandler={createSortHandler}
        rows={visibleRows}
      />
      <TablePagination
        rowsPerPageOptions={[20, 50, 100, 200, { label: "All", value: -1 }]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};
