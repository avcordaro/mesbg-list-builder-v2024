import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppState } from "../../state/app";
import { drawers } from "./drawers.tsx";

export const DrawerContainer = () => {
  const state = useAppState();

  return [...drawers.entries()].map(([type, props]) => {
    return (
      <Drawer
        key={type}
        open={type === state.currentlyOpenendSidebar}
        anchor="right"
        onClose={() => state.closeSidebar()}
        PaperProps={{
          sx: { width: "min(72ch, 100%)" },
        }}
      >
        <Stack
          direction="row"
          sx={{
            mb: 1,
            p: 1.5,
            boxShadow: "0 0 5px 0 black",
          }}
          justifyContent="center"
          alignItems="center"
        >
          <Box flexGrow={1}>
            <Typography variant="h5" className="middle-earth">
              {props.title}
            </Typography>
          </Box>
          <IconButton onClick={() => state.closeSidebar()}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Box sx={{ px: 2, pt: 1, pb: 2, height: "100%" }}>{props.children}</Box>
      </Drawer>
    );
  });
};
