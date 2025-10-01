import { Stack, TextField, Typography } from "@mui/material";
import { forwardRef, MouseEvent, useImperativeHandle } from "react";
import { CustomAlert } from "../../atoms/alert/CustomAlert.tsx";
import { CustomSwitch } from "../../atoms/switch/CustomSwitch.tsx";
import { AdditionalTagsInput } from "../../atoms/tags-input/TagsInput.tsx";
import { useCreateCustomRoster } from "./useCustomCreateRoster.ts";

export type CreateCustomRosterHandlers = {
  handleCreateRoster: (e: MouseEvent) => void;
};

export const CreateCustomRoster = forwardRef<CreateCustomRosterHandlers>(
  (_, ref) => {
    const {
      rosterName,
      maxRosterPoints,
      goodOrEvil,
      tags,
      setRosterName,
      setMaxRosterPoints,
      setGoodOrEvil,
      setTags,
      handleCreateNewRoster,
    } = useCreateCustomRoster();

    useImperativeHandle(ref, () => ({
      handleCreateRoster: (e) => handleCreateNewRoster(e),
    }));

    return (
      <>
        <CustomAlert title="Experimental feature" severity="warning">
          Create a custom roster without any list building restrictions other
          than Good vs Evil. Let your creativity fly!
        </CustomAlert>

        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <Typography
            sx={
              goodOrEvil === "Good"
                ? { textDecoration: "underline", fontWeight: "bold" }
                : { cursor: "pointer" }
            }
            onClick={() => setGoodOrEvil("Good")}
          >
            Good
          </Typography>
          <CustomSwitch
            checked={goodOrEvil === "Evil"}
            onChange={(_, checked) => setGoodOrEvil(!checked ? "Good" : "Evil")}
            name="good or evil"
          />
          <Typography
            sx={
              goodOrEvil === "Evil"
                ? { textDecoration: "underline", fontWeight: "bold" }
                : { cursor: "pointer" }
            }
            onClick={() => setGoodOrEvil("Evil")}
          >
            Evil
          </Typography>
        </Stack>

        <TextField
          fullWidth
          label="Roster name (Optional)"
          value={rosterName}
          onChange={(e) => setRosterName(e.target.value)}
        />

        <TextField
          fullWidth
          label="Points (Optional)"
          value={maxRosterPoints}
          helperText={
            maxRosterPoints !== "" && Number(maxRosterPoints) <= 0
              ? "Please enter a value above 0"
              : ""
          }
          error={maxRosterPoints !== "" && Number(maxRosterPoints) <= 0}
          onChange={(e) => setMaxRosterPoints(e.target.value)}
          slotProps={{
            input: { type: "number" },
          }}
        />
        <AdditionalTagsInput values={tags} onChange={setTags} size="medium" />
      </>
    );
  },
);
