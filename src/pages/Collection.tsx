import {
  BookmarkAdd,
  Cancel,
  CancelRounded,
  Edit,
  UploadFile,
} from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  FormHelperText,
  InputAdornment,
  SpeedDial,
  SpeedDialAction,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { ChangeEvent, useRef, useState } from "react";
import { SquareIconButton } from "../components/atoms/icon-button/SquareIconButton.tsx";
import { Link } from "../components/atoms/link/Link.tsx";
import { ModalTypes } from "../components/modal/modals.tsx";
import { useApi } from "../hooks/cloud-sync/useApi.ts";
import { useAppState } from "../state/app";
import { useCollectionState } from "../state/collection";
import { useUserPreferences } from "../state/preference";
import { useThemeContext } from "../theme/ThemeContext.tsx";
import { rows as databaseRows } from "./database/data.ts";
import { COMPOSED_UNIT_MAP } from "./database/utils/special-rows.ts";

export const Collection = () => {
  const { palette } = useTheme();
  const { setCurrentModal } = useAppState();
  const { inventory, deleteEntry } = useCollectionState();
  const { deleteFromCollection } = useApi();
  const { preferences, setPreference } = useUserPreferences();
  const { mode } = useThemeContext();
  const speedDialRef = useRef<HTMLDivElement | null>(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const filterElements = filter.toLowerCase().split(";");

  const collection = Object.entries(inventory)
    .flatMap(([origin, model]) =>
      Object.entries(model).flatMap(([modelName, inventory]) => ({
        origin,
        modelName,
        inventory,
      })),
    )
    .sort((a, b) => {
      // First sort by origin
      if (a.origin < b.origin) return -1;
      if (a.origin > b.origin) return 1;

      // If origins are the same, sort by modelName
      if (a.modelName < b.modelName) return -1;
      if (a.modelName > b.modelName) return 1;

      return 0;
    });

  const removeItem = (origin: string, model: string) => {
    deleteEntry(origin, model);
    deleteFromCollection(origin, model);
  };

  return (
    <Container
      maxWidth={false}
      sx={{ p: 2, mb: 12, maxWidth: "calc(100vw - 3*24px)" }}
    >
      <Typography variant="h4" className="middle-earth" sx={{ mb: 2 }}>
        My Collection
      </Typography>

      <Typography>
        Easily manage your personal collection of miniatures, which allows the
        list builder to provide helpful warnings if you exceed the models
        available in your collection. These warnings can be enabled/disabled in
        the app settings.
      </Typography>
      <Typography sx={{ my: 2 }}>
        You can add models to your collection using the{" "}
        <BookmarkAdd sx={{ verticalAlign: "bottom" }} /> button on the{" "}
        <Link to="/database">Profile Database</Link> page.
      </Typography>
      {!preferences.collectionWarnings && (
        <Alert severity="warning" icon={false} sx={{ my: 1 }}>
          <Typography sx={{ gap: 0.4 }}>
            Collection warnings in the list builder are currently turned off.
            <Button onClick={() => setPreference("collectionWarnings", true)}>
              Click here
            </Button>
            to enable them.
          </Typography>
        </Alert>
      )}
      <Stack direction="column" gap={1} sx={{ mt: 1 }} alignItems="left">
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
        <FormHelperText sx={{ mt: -0.5 }}>
          You can combine filters using semicolons - for example: &quot;Gondor;
          Aragorn&quot;
        </FormHelperText>
      </Stack>
      <TableContainer sx={{ mt: 2 }}>
        <Table>
          <TableHead
            sx={{
              "& > tr > th": {
                backgroundColor: (theme) =>
                  mode === "dark"
                    ? theme.palette.grey.A700
                    : theme.palette.grey.A200,
              },
            }}
          >
            <TableRow>
              <TableCell size="small" sx={{ minWidth: 240 }}>
                Model
              </TableCell>
              <TableCell size="small" sx={{ minWidth: 170 }}>
                Origin
              </TableCell>
              <TableCell size="small" sx={{ minWidth: 240 }}>
                Collection
              </TableCell>
              <TableCell size="small" sx={{ minWidth: 170 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {collection
              .filter((row) => {
                const searchString =
                  `${row.origin} ${row.modelName}`.toLowerCase();
                return filterElements.every((el) => searchString.includes(el));
              })
              .map((row, index) => {
                const dbRow = databaseRows.find(
                  (dbRow) =>
                    dbRow.profile_origin === row.origin &&
                    dbRow.name === row.modelName,
                );
                return (
                  <TableRow key={index}>
                    <TableCell>{row.modelName}</TableCell>
                    <TableCell>{row.origin}</TableCell>
                    <TableCell size="small">
                      {row.inventory.collection.map((item, itemIndex) => (
                        <Typography key={itemIndex}>
                          {item.amount}x{" "}
                          {typeof item.options === "string"
                            ? item.options
                            : item.options.join(", ")}
                          {item.mount ? ` on ${item.mount}` : ""}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" gap={2} justifyContent="end">
                        <SquareIconButton
                          icon={<Edit sx={{ fontSize: "1.5rem" }} />}
                          iconColor={palette.primary.contrastText}
                          backgroundColor={palette.primary.main}
                          backgroundColorHover={palette.primary.dark}
                          disabled={
                            !dbRow &&
                            !["Shank & Wrot", "Bard's Family"].includes(
                              row.modelName,
                            )
                          }
                          iconPadding="1"
                          onClick={() => {
                            setCurrentModal(ModalTypes.ADD_TO_COLLECTION, {
                              unit: {
                                name:
                                  COMPOSED_UNIT_MAP[row.modelName] ||
                                  row.modelName,
                                profile_origin: row.origin,
                                options: dbRow?.options ?? [],
                                option_mandatory:
                                  dbRow?.option_mandatory ?? false,
                                unit_type: dbRow?.unit_type || ["Hero"],
                              },
                              title: `Edit collection`,
                            });
                          }}
                        />
                        <SquareIconButton
                          icon={<Cancel sx={{ fontSize: "1.5rem" }} />}
                          iconColor={palette.error.contrastText}
                          backgroundColor={palette.error.main}
                          backgroundColorHover={palette.error.dark}
                          iconPadding="1"
                          onClick={() => removeItem(row.origin, row.modelName)}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}

            {collection.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Alert severity="info">
                    <Typography>
                      Your collection is currently empty! You can add models to
                      your collection using the{" "}
                      <BookmarkAdd sx={{ verticalAlign: "bottom" }} /> button on
                      the <Link to="/database">Profile Database</Link> page.
                    </Typography>
                  </Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box ref={speedDialRef}>
        <SpeedDial
          ariaLabel="action-buttons"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          icon={<SaveIcon />}
          open={fabOpen}
          onClick={() => setFabOpen((x) => !x)}
          onClose={null}
        >
          <SpeedDialAction
            icon={<SaveIcon />}
            onClick={() => setCurrentModal(ModalTypes.EXPORT_COLLECTION)}
            tooltipTitle={
              <span
                style={{
                  whiteSpace: "nowrap",
                  color: mode === "dark" ? "white" : "inherit",
                }}
              >
                Export Collection
              </span>
            }
            tooltipOpen
          />
          <SpeedDialAction
            icon={<UploadFile />}
            onClick={() => setCurrentModal(ModalTypes.IMPORT_COLLECTION)}
            tooltipTitle={
              <span
                style={{
                  whiteSpace: "nowrap",
                  color: mode === "dark" ? "white" : "inherit",
                }}
              >
                Import Collection
              </span>
            }
            tooltipOpen
          />
        </SpeedDial>
      </Box>
    </Container>
  );
};
