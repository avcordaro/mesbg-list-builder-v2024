import { InfoOutlined } from "@mui/icons-material";
import { Button, Collapse, InputAdornment, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { TbMobiledata, TbMobiledataOff } from "react-icons/tb";
import { useSearchParams } from "react-router-dom";
import { CustomAlert } from "../../../components/atoms/alert/CustomAlert.tsx";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { useLockContext } from "../../../hooks/lock/useLockContext.ts";
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
        <DragAndLockButton />
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
          <Stack gap={2}>
            <Typography component="div">
              Filter rosters with queries like:{" "}
              <pre style={{ display: "inline" }}>
                &quot;type=evil&name=my army&points&gt;700&quot;
              </pre>
            </Typography>
            <Typography>
              Available fields: type, army, name, points, tag, units, bows,
              throw, might, will, fate
              <br />
              Use =, !=, &gt;, &lt;, &gt;=, &lt;= for comparisons. Combine
              multiple rules with &.
            </Typography>
            <Typography>
              Prefix your query with{" "}
              <i>
                <code>&quot;~ignore-groups&quot;</code>
              </i>{" "}
              to do a global search within all your rosters.
            </Typography>
          </Stack>
        </CustomAlert>
      </Collapse>
    </>
  );
};

function DragAndLockButton() {
  const screen = useScreenSize();
  const { lock, toggleLock } = useLockContext();

  if (screen.isMobile) return null;

  return (
    <Button
      sx={{ width: "5ch" }}
      variant="outlined"
      color="inherit"
      aria-label="toggle drag and drop"
      onClick={toggleLock}
    >
      <Stack alignItems="center" sx={{ pt: 0.4 }}>
        {lock ? (
          <TbMobiledataOff fontSize="1.45rem" />
        ) : (
          <TbMobiledata fontSize="1.45rem" />
        )}
        <Typography variant="subtitle1" sx={{ fontSize: "0.65rem" }}>
          {lock ? "Off" : "On"}
        </Typography>
      </Stack>
    </Button>
  );
}
