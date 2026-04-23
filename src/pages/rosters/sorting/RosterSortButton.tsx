import { Button, ListItemIcon } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { FcCheckmark } from "react-icons/fc";

export type SortOrder = "asc" | "desc";
export type SortField = "name" | "army" | "points" | "units";

export const RosterSortButton = ({
  setOrdering,
  order,
  field,
}: {
  setOrdering: (field: SortField, order: SortOrder) => void;
  order: SortOrder;
  field: SortField;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const fields: SortField[] = useMemo(
    () => ["name", "army", "points", "units"],
    [],
  );
  const icons = {
    asc: <AiOutlineSortAscending fontSize="1.45rem" />,
    desc: <AiOutlineSortDescending fontSize="1.45rem" />,
  };

  /**
   * Effect to automatically reset the sort order/field if its invalid
   */
  useEffect(() => {
    const validOrder = ["asc", "desc"].includes(order);
    const validField = fields.includes(field);
    if (!validOrder || !validField) {
      setOrdering(validField ? field : fields[0], validOrder ? order : "asc");
    }
  }, [order, field, fields, setOrdering]);

  const setSorting =
    (field: SortField) =>
    (order: "asc" | "desc") =>
    (e: MouseEvent<HTMLElement>) => {
      setOrdering(field, order);
      handleClose(e);
    };

  const handleOpenSortOptions = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        sx={{ width: "5ch" }}
        variant="outlined"
        color="inherit"
        aria-label="more"
        aria-controls={open ? "menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleOpenSortOptions}
      >
        <Stack alignItems="center" sx={{ pt: 0.4 }}>
          {icons[order]}
          <Typography variant="subtitle1" sx={{ fontSize: "0.65rem" }}>
            {field?.toUpperCase()}
          </Typography>
        </Stack>
      </Button>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {fields
          .flatMap((field) => [
            { field, order: "asc" as const },
            { field, order: "desc" as const },
          ])
          .map((sortItem) => (
            <MenuItem
              onClick={setSorting(sortItem.field)(sortItem.order)}
              key={`${sortItem.field}-${sortItem.order}`}
            >
              <ListItemText sx={{ width: "20ch", textTransform: "capitalize" }}>
                {sortItem.field} {sortItem.order}.
              </ListItemText>
              <ListItemIcon
                sx={{
                  justifyContent: "end",
                  visibility:
                    field === sortItem.field && order === sortItem.order
                      ? "visible"
                      : "hidden",
                }}
              >
                <FcCheckmark />
              </ListItemIcon>
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};
