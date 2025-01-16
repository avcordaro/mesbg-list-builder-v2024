import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export type ScreenSize = "mobile" | "tablet" | "desktop";

export const useScreenSize = (): {
  getSize: () => ScreenSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTooSmall: boolean;
} => {
  const theme = useTheme();

  const isTooSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "xl"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("xl"));

  function getSize(): ScreenSize {
    if (isMobile) return "mobile";
    if (isTablet) return "tablet";
    if (isDesktop) return "desktop";
  }

  return { getSize, isMobile, isTablet, isDesktop, isTooSmall };
};
