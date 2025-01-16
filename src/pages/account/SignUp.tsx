import {
  Button,
  FormControl,
  FormLabel,
  Stack,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomAlert } from "../../components/common/alert/CustomAlert.tsx";
import { useAuth } from "../../firebase/FirebaseAuthContext.tsx";

const errorMap = {
  "auth/email-already-in-use":
    "An account with this email already exists. Sign in or use a different email.",
  "auth/invalid-email":
    "That doesn’t look like a valid email address. Please check and try again.",
  "auth/invalid-password":
    "Your password must be at least 6 characters long and include a mix of letters, numbers, and special characters.",
  "auth/invalid-display-name":
    "You display name cannot be empty. Please provide us with you name",
  "auth/too-many-requests": "",
};

export const SignUp = () => {
  const auth = useAuth();
  const [signInError, setSignInError] = useState(null);
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState(false);
  const [
    passwordConfirmationErrorMessage,
    setPasswordConfirmationErrorMessage,
  ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user) {
      navigate(`/rosters?asksync=true`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nameError || emailError || passwordError || passwordConfirmationError)
      return;

    const data = new FormData(event.currentTarget);
    auth
      .signUp(
        data.get("email") as string,
        data.get("password") as string,
        data.get("name") as string,
      )
      .then((response) => console.log(response))
      .catch((error) => {
        if (error.code === "auth/password-does-not-meet-requirements") {
          const reason = error.message?.match(/\[(.*?)]/);
          if (reason) {
            setSignInError(reason[1]);
          }
        } else {
          console.error(error.code);
          setSignInError(
            errorMap[error.code] ??
              "Oops! We encountered an error. Please refresh the page and try again.",
          );
        }
      });
  };

  const validateInputs = () => {
    const name = document.getElementById("name") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const password2 = document.getElementById(
      "password-confirmation",
    ) as HTMLInputElement;

    let isValid = true;

    if (!name.value || name.value.length < 3) {
      setNameError(true);
      setNameErrorMessage("Please enter a display name.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value) {
      setPasswordError(true);
      setPasswordErrorMessage("You must enter a password to sign in.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (password.value !== password2.value) {
      setPasswordConfirmationError(true);
      setPasswordConfirmationErrorMessage(
        "Your passwords don’t match. Re-enter them to ensure they’re the same.",
      );
      isValid = false;
    } else {
      setPasswordConfirmationError(false);
      setPasswordConfirmationErrorMessage("");
    }

    return isValid;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 5 }}>
      <Typography variant="h4" className="middle-earth">
        Sign Up
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Create your account for free by providing your name, email and a
        password.
      </Typography>

      {signInError && (
        <Box sx={{ my: 2 }}>
          <CustomAlert title="Authentication error" severity="error">
            {signInError}
          </CustomAlert>
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Display name</FormLabel>
          <TextField
            error={nameError}
            helperText={nameErrorMessage}
            id="name"
            type="text"
            name="name"
            placeholder="John Doe"
            autoComplete="name"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={nameError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={passwordError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password confirmation</FormLabel>
          <TextField
            error={passwordConfirmationError}
            helperText={passwordConfirmationErrorMessage}
            name="password-confirmation"
            placeholder="••••••"
            type="password"
            id="password-confirmation"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={passwordConfirmationError ? "error" : "primary"}
          />
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={validateInputs}
        >
          Create account
        </Button>
        <Stack
          direction="row"
          gap={2}
          justifyContent="center"
          alignItems="center"
        >
          <Typography>Already have an account?</Typography>
          <Button
            onClick={() =>
              navigate("/sign-in", { state: { allowNavigation: true } })
            }
          >
            Sign In
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};
