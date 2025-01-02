import { DrawerTypes } from "../../../components/drawer/drawers.tsx";
import { Slice } from "../../Slice.ts";
import { ApplicationState } from "../index.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SidebarContext = any;

export type SidebarState = {
  currentlyOpenendSidebar: DrawerTypes | null;
  openSidebar: (sidebarType: DrawerTypes, context?: SidebarContext) => void;
  openSidebarContext?: SidebarContext;
  closeSidebar: () => void;
};

const initialState = {
  currentlyOpenendSidebar: null,
};

export const sidebarSlice: Slice<ApplicationState, SidebarState> = (set) => ({
  ...initialState,

  openSidebar: (sidebar, context) =>
    set(
      { currentlyOpenendSidebar: sidebar, openSidebarContext: context },
      undefined,
      "OPEN_SIDEBAR",
    ),
  closeSidebar: () =>
    set(
      { currentlyOpenendSidebar: null, openSidebarContext: null },
      undefined,
      "CLOSE_SIDEBAR",
    ),
});
