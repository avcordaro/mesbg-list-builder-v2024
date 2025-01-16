import {
  Button,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useFirebaseAuth } from "../../../firebase/useFirebaseAuth.ts";
import { useAppState } from "../../../state/app";
import { AlertTypes } from "../../alerts/alert-types.tsx";
import { CustomAlert } from "../../common/alert/CustomAlert.tsx";

export const ResetPassword = () => {
  const {
    closeModal,
    modalContext: { email: predefinedEmail },
    triggerAlert,
  } = useAppState();
  const { resetPassword } = useFirebaseAuth();

  const [email, setEmail] = useState(predefinedEmail ?? "");
  const [emailValid, setEmailValid] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);

  const sendRequest = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailValid(false);
      return;
    }

    resetPassword(email)
      .then(() => {
        closeModal();
        triggerAlert(AlertTypes.PASSWORD_RESET_REQUEST_SEND);
      })
      .catch((error) => setFirebaseError(error.code));
  };

  return (
    <>
      <DialogContent>
        <Stack gap={1}>
          <CustomAlert severity="info" title="Reset password request">
            Please provide the email adres you signed up with so we can send you
            a reset password link.
          </CustomAlert>
          {firebaseError && (
            <CustomAlert severity="error" title="Request failed">
              <Typography>
                The authentication provider failed to send the password reset.
                We received the following error:{" "}
                <b>&quot;{firebaseError}&quot;</b>.
              </Typography>
              <Typography>Please reach out if the problem persists.</Typography>
            </CustomAlert>
          )}
        </Stack>

        <TextField
          sx={{ mt: 2 }}
          fullWidth
          label="Emailadress"
          error={!emailValid}
          helperText={
            !emailValid
              ? "That doesn’t look like a valid email address. Please check and try again."
              : ""
          }
          value={email}
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailValid(true);
          }}
        />
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="text"
          color="inherit"
          onClick={closeModal}
          sx={{ minWidth: "20ch" }}
          data-test-id="dialog--cancel-button"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={sendRequest}
          data-test-id="dialog--submit-button"
        >
          Send request
        </Button>
      </DialogActions>
    </>
  );
};
