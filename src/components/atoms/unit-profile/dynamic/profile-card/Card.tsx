import { Box } from "@mui/material";
import styled from "@mui/material/styles/styled";

export const Card = styled(Box)(() => ({
  position: "relative",
  width: "24cm",
  padding: "2rem",
  aspectRatio: 1.484,
  backgroundSize: "cover",
  backgroundPosition: "center",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  border: "1px solid rgb(243 231 215)",
  margin: "0.5rem",
  borderRadius: "1rem",
  boxShadow: "rgba(0, 0, 0, 0.2) 0 5px 5px",
  color: "black",
}));
