import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Badge, Collapse, Tooltip } from "@mui/material";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon/ListItemIcon";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import { ReactNode, useState } from "react";
import { slugify } from "../../../utils/string.ts";
import { isDivider } from "./isDivider.ts";

export type NavLink = {
  icon: ReactNode;
  label: string;
  action: () => void;
  active: boolean;
  children?: NavItem[];
  showCaret?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  badge?: boolean;
};

export type NavDivider = {
  divider: boolean;
};

export type NavItem = NavDivider | NavLink;

export const NavItemLink = ({
  item,
  open,
  pl = 0,
}: {
  item: NavLink;
  open: boolean;
  pl?: number;
}) => {
  const [expanded, setExpanded] = useState<boolean>(item.showCaret);

  return (
    <>
      <Tooltip title={item.disabled ? item.disabledReason : ""}>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            sx={[
              { minHeight: 48, pr: 2.5, pl: pl + 2.5 },
              open
                ? { justifyContent: "initial" }
                : { justifyContent: "center" },
            ]}
            selected={item.active}
            onClick={() => {
              if (item.showCaret) {
                setExpanded(!expanded);
                window.dispatchEvent(
                  new Event("mlb-event--open-navigation-drawer"),
                );
              } else {
                item.action();
              }
            }}
            disabled={item.disabled}
            data-test-id={slugify(item.label) + "--nav-link"}
          >
            <Tooltip title={open ? "" : item.label}>
              <ListItemIcon
                sx={[
                  { minWidth: 0, justifyContent: "center" },
                  open ? { mr: 3 } : { mr: "auto" },
                ]}
              >
                <Badge
                  color="primary"
                  variant="dot"
                  badgeContent={item.badge ? 1 : 0}
                  overlap="circular"
                >
                  {item.icon}
                </Badge>
              </ListItemIcon>
            </Tooltip>

            <ListItemText
              primary={item.label}
              sx={[
                {
                  "& span": {
                    display: "inline-block",
                    width: "21ch",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                },
                open ? { opacity: 1 } : { opacity: 0 },
              ]}
            />

            {item.children && item.showCaret && open && (
              <> {expanded ? <ExpandLess /> : <ExpandMore />}</>
            )}
          </ListItemButton>
        </ListItem>
      </Tooltip>

      {item.children && item.children.length > 0 && (
        <Collapse in={(!expanded && open) || !item.showCaret}>
          {item.children?.map((subItem, index) =>
            isDivider(subItem) ? (
              <Divider key={index} />
            ) : (
              <NavItemLink
                key={index}
                item={subItem}
                open={open}
                pl={open ? pl + 3 : 0}
              />
            ),
          )}
        </Collapse>
      )}
    </>
  );
};
