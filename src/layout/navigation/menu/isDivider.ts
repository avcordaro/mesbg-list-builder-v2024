import { NavDivider, NavItem } from "./NavItemLink.tsx";

export const isDivider = (item: NavItem): item is NavDivider =>
  !!(item as NavDivider).divider;
