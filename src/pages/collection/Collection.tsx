import { BookmarkAdd, Cancel, Edit } from "@mui/icons-material";
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { SquareIconButton } from "../../components/common/icon-button/SquareIconButton.tsx";
import { ModalTypes } from "../../components/modal/modals.tsx";
import { useAppState } from "../../state/app";
import { useCollectionState } from "../../state/collection";
import { rows as databaseRows } from "../database/data.ts";

export const Collection = () => {
  const { palette } = useTheme();
  const { setCurrentModal } = useAppState();
  const { inventory, deleteEntry } = useCollectionState();

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
  };

  return (
    <Container maxWidth={false} sx={{ p: 2 }}>
      <Typography variant="h4" className="middle-earth" sx={{ mb: 2 }}>
        Your collection
      </Typography>

      <Typography>
        Managing a collection of the miniatures that you have allows this
        builder to indicate possible problems you might have when packing for
        matches. These warnings can be enabled/disabled in the app settings.
      </Typography>
      <Typography>
        You can add more models using the &apos;add to collection&apos; button
        on the <Link to="/database">database</Link> page.
      </Typography>

      <TableContainer sx={{ mt: 2 }}>
        <Table>
          <TableHead
            sx={{
              "& > tr > th": {
                backgroundColor: (theme) => theme.palette.grey.A200,
              },
            }}
          >
            <TableRow>
              <TableCell size="small">Model</TableCell>
              <TableCell size="small">Origin</TableCell>
              <TableCell size="small">Collection</TableCell>
              <TableCell size="small" />
            </TableRow>
          </TableHead>
          <TableBody>
            {collection.map((row, index) => {
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
                        disabled={!dbRow}
                        iconPadding="1"
                        onClick={() => {
                          setCurrentModal(ModalTypes.ADD_TO_COLLECTION, {
                            unit: {
                              name: dbRow.name,
                              profile_origin: dbRow.profile_origin,
                              options: dbRow.options,
                              option_mandatory: dbRow.option_mandatory,
                              unit_type: dbRow.unit_type,
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
                    <Stack direction="row" gap={0.5}>
                      <Typography>
                        Your collection is still empty. Start adding models via
                        the
                      </Typography>
                      <BookmarkAdd />
                      <Typography>button on the database view.</Typography>
                    </Stack>
                  </Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
