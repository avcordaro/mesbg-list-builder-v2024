import { TextField } from "@mui/material";
import { forwardRef, MouseEvent, useImperativeHandle } from "react";
import { CustomAlert } from "../../atoms/alert/CustomAlert.tsx";
import { ArmySelectionInput } from "../../atoms/army-selector/ArmySelectionInput.tsx";
import { AdditionalTagsInput } from "../../atoms/tags-input/TagsInput.tsx";
import { useCreateRoster } from "./useCreateRoster.ts";

export type CreateMatchedPlayRosterHandlers = {
  handleCreateRoster: (e: MouseEvent) => void;
};
export const CreateMatchedPlayRoster =
  forwardRef<CreateMatchedPlayRosterHandlers>((_, ref) => {
    const {
      armyList,
      rosterName,
      maxRosterPoints,
      tags,
      setArmyList,
      setTags,
      updateRosterName,
      updateMaxRosterPoints,
      handleCreateNewRoster,
    } = useCreateRoster();

    useImperativeHandle(ref, () => ({
      handleCreateRoster: (e) => handleCreateNewRoster(e),
    }));

    return (
      <>
        <CustomAlert title="" severity="info">
          Create a roster for your regular matches using the standard list
          building rules.
        </CustomAlert>
        <ArmySelectionInput armyList={armyList} setArmyList={setArmyList} />

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

        <AdditionalTagsInput values={tags} onChange={setTags} size="medium" />
      </>
    );
  });
