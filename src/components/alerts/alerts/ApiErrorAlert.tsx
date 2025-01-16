import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Fragment, FunctionComponent } from "react";

export const ApiErrorAlert: FunctionComponent<{
  context?: Record<string, string>;
}> = (props) => {
  return (
    <Fragment>
      <Stack>
        <Typography variant="body1" fontWeight={800}>
          {props.context.title}
        </Typography>
        <Typography variant="body2">
          A request to sync with the server failed:{" "}
          <i>{props.context.message}</i>
        </Typography>
      </Stack>
    </Fragment>
  );
};
