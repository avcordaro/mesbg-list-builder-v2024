import { CancelRounded } from "@mui/icons-material";
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
import { mesbgData, profileData } from "../../assets/data.ts";
import { Unit } from "../../types/mesbg-data.types.ts";
import { DatabaseTable } from "./components/DatabaseTable.tsx";
import { getComparator, Order } from "./utils/sorting.ts";
import {
  convertBardsFamilyToSingleRows,
  convertShankAndWrotToSingleRows,
} from "./utils/special-rows.ts";

const rows = Object.values(
  Object.values(mesbgData).reduce((acc, currentValue) => {
    const name = currentValue.name;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(currentValue);

    return acc;
  }, {}),
)
  .flatMap((dataPoint: Unit[]) => {
    if (dataPoint[0].name === "Bard's Family") {
      return convertBardsFamilyToSingleRows(dataPoint);
    }
    if (dataPoint[0].name === "Shank & Wrot") {
      return convertShankAndWrotToSingleRows(dataPoint);
    }
    return {
      name: dataPoint[0].name,
      army_type: dataPoint[0].army_type,
      profile_origin: dataPoint[0].profile_origin,
      unit_type: [...new Set(dataPoint.map((p) => p.unit_type))],
      army_list: dataPoint.map((p) => p.army_list),
      options: [
        ...new Set(dataPoint.flatMap((p) => p.options).map((o) => o.name)),
      ],
      MWFW: dataPoint.flatMap((p) => p.MWFW),
      profile: profileData[dataPoint[0].profile_origin][dataPoint[0].name],
    };
  })
  .map((row) => {
    const [M, W, F] =
      row.name === "The Witch-king of Angmar" || row.name === "Ringwraith"
        ? ["*", "*", "*"]
        : row.MWFW[0]
          ? row.MWFW[0][1].split(":")
          : ["-", "-", "-"];
    return {
      ...row,
      Mv: !Number.isNaN(parseInt(row.profile.Mv))
        ? parseInt(row.profile.Mv)
        : -1,
      M,
      W,
      F,
      searchString: [
        row.name,
        row.profile_origin,
        row.army_list.join(","),
        row.profile.special_rules.join(","),
        row.profile.heroic_actions.join(","),
        row.profile.wargear.join(","),
        row.profile.active_or_passive_rules.map(({ name }) => name).join(","),
        row.profile.magic_powers.map(({ name }) => name).join(","),
      ]
        .join(",")
        .toLowerCase(),
    };
  });

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
      <Typography variant="h4" className="middle-earth" sx={{ mb: 2 }}>
        Profile database
      </Typography>

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
        <Typography sx={{ whiteSpace: "nowrap" }}>
          <strong>{filteredRows.length} Profiles</strong>
        </Typography>
      </Stack>
      <FormHelperText sx={{ mb: 2 }}>
        Try combining filters using the ; symbol, for example: &quot;Gondor;
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
