import { CancelRounded } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { ChangeEvent, FunctionComponent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  RosterSortButton,
  SortField,
  SortOrder,
} from "../sorting/RosterSortButton.tsx";

type RosterFilterProps = {
  filter: string;
  setFilter: (filter: string) => void;
};

export const RostersSearchFilter: FunctionComponent<RosterFilterProps> = ({
  filter,
  setFilter,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setSortParams = (field: SortField, order: SortOrder) => {
    const params = new URLSearchParams();
    params.set("sortBy", field);
    params.set("direction", order);
    setSearchParams(params, { preventScrollReset: true });
  };

  return (
    <Stack direction="row" gap={2} sx={{ py: 2 }}>
      <TextField
        id="database-filter-input"
        label="Filter"
        placeholder="Start typing to filter"
        value={filter}
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
      <RosterSortButton
        setOrdering={setSortParams}
        order={searchParams.get("direction") as SortOrder}
        field={searchParams.get("sortBy") as SortField}
      />
    </Stack>
  );
};
