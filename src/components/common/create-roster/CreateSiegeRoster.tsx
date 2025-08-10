import { Stack, TextField, Typography } from "@mui/material";
import { forwardRef, MouseEvent, useImperativeHandle, useState } from "react";
import { CustomAlert } from "../alert/CustomAlert.tsx";
import { CustomSwitch } from "../switch/CustomSwitch.tsx";
import { ArmySelectionInput } from "./ArmySelectionInput.tsx";
import { useCreateRoster } from "./useCreateRoster.ts";

export type CreateSiegeRosterHandlers = {
  handleCreateRoster: (e: MouseEvent) => void;
};
export const CreateSiegeRoster = forwardRef<CreateSiegeRosterHandlers>(
  (_, ref) => {
    const {
      armyList,
      setArmyList,
      rosterName,
      updateRosterName,
      maxRosterPoints,
      updateMaxRosterPoints,
      handleCreateNewRoster,
    } = useCreateRoster();

    const [siegeRole, setSiegeRole] = useState<"Attacker" | "Defender">(
      "Attacker",
    );

    useImperativeHandle(ref, () => ({
      handleCreateRoster: (e) => handleCreateNewRoster(e, true, siegeRole),
    }));

    return (
      <>
        <CustomAlert title="" severity="info">
          Create a roster with siege options. This type of roster enables siege
          equipment like ladders, rams and barricades.
        </CustomAlert>
        <ArmySelectionInput armyList={armyList} setArmyList={setArmyList} />
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <Typography
            sx={
              siegeRole === "Defender"
                ? { textDecoration: "underline", fontWeight: "bold" }
                : { cursor: "pointer" }
            }
            onClick={() => setSiegeRole("Defender")}
          >
            Defender
          </Typography>
          <CustomSwitch
            checked={siegeRole === "Attacker"}
            onChange={(_, checked) =>
              setSiegeRole(checked ? "Attacker" : "Defender")
            }
            name="siege role"
          />
          <Typography
            sx={
              siegeRole === "Attacker"
                ? { textDecoration: "underline", fontWeight: "bold" }
                : { cursor: "pointer" }
            }
            onClick={() => setSiegeRole("Attacker")}
          >
            Attacker
          </Typography>
        </Stack>
        <TextField
          fullWidth
          label="Roster name (Optional)"
          value={rosterName}
          onChange={(e) => updateRosterName(e.target.value)}
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
          onChange={(e) => updateMaxRosterPoints(e.target.value)}
          slotProps={{
            input: { type: "number" },
          }}
        />
      </>
    );
  },
);
