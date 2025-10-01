import { InfoOutlined } from "@mui/icons-material";
import { Collapse, InputAdornment, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CustomAlert } from "../../../components/atoms/alert/CustomAlert.tsx";
import { RosterBulkDeleteButton } from "../bulk-delete/RosterBulkDeleteButton.tsx";
import {
  RosterSortButton,
  SortField,
  SortOrder,
} from "../sorting/RosterSortButton.tsx";

type RosterFilterProps = {
  filter: string;
  setFilter: (filter: string) => void;
  deleting: boolean;
  toggleDelete: () => void;
  selectedRosters: string[];
};

export const RostersSearchFilter: FunctionComponent<RosterFilterProps> = ({
  filter,
  setFilter,
  deleting,
  toggleDelete,
  selectedRosters,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showHelperText, setShowHelperText] = useState(false);

  const setSortParams = (field: SortField, order: SortOrder) => {
    const params = new URLSearchParams();
    params.set("sortBy", field);
    params.set("direction", order);
    setSearchParams(params, { preventScrollReset: true });
  };

  return (
    <>
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
                    aria-label="show query helper"
                    onClick={() => setShowHelperText((value) => !value)}
                    edge="end"
                    color="info"
                  >
                    <InfoOutlined />
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
        <RosterBulkDeleteButton
          toggleBulkDelete={toggleDelete}
          isDeleting={deleting}
          selectedRosters={selectedRosters}
        />
      </Stack>
      <Collapse in={showHelperText}>
        <CustomAlert
          title="Query helper"
          severity="info"
          onClose={() => setShowHelperText(false)}
        >
          <Typography component="div">
            Filter rosters with queries like:{" "}
            <pre style={{ display: "inline" }}>
              &quot;type=evil&name=my army&points&gt;700&quot;
            </pre>
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Available fields: type, army, name, points, tag, units, bows, throw,
            might, will, fate
            <br />
            Use =, !=, &gt;, &lt;, &gt;=, &lt;= for comparisons. Combine
            multiple rules with &.
          </Typography>
        </CustomAlert>
      </Collapse>
    </>
  );
};
