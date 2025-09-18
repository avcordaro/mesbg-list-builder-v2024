import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const AppFallback = () => {
  const error = useRouteError();
  let errorMessage: string;
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.stack || error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 2,
        }}
      >
        <Typography variant="h3">Oh no!</Typography>
        <Typography
          variant="caption"
          component="pre"
          sx={{
            px: 5,
            borderLeft: 1,
          }}
        >
          {errorMessage}
        </Typography>
      </Container>
    </>
  );
};
