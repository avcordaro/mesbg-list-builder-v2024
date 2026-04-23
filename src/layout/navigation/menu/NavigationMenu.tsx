import Divider from "@mui/material/Divider";
import List from "@mui/material/List/List";
import { NavItemLink } from "./NavItemLink.tsx";
import { isDivider } from "./isDivider.ts";
import { useMenuItems } from "./useMenuItems.tsx";

type NavigationMenuProps = {
  open: boolean;
};

export const NavigationMenu = ({ open }: NavigationMenuProps) => {
  const menuItems = useMenuItems();
  return (
    <List component="nav">
      {menuItems.map((item, index) =>
        isDivider(item) ? (
          <Divider key={index} />
        ) : (
          <NavItemLink key={index} item={item} open={open} />
        ),
      )}
    </List>
  );
};
