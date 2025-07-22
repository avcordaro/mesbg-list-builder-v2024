import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import { forwardRef, useImperativeHandle } from "react";
import tta2mlbJson from "../../../assets/data/tta2mlb.json";
import { useRosterInformation } from "../../../hooks/useRosterInformation.ts";
import { isSelectedUnit, SelectedUnit } from "../../../types/roster.ts";
import { selectedOptionWithType } from "../../../utils/options.ts";
import { CustomAlert } from "../alert/CustomAlert.tsx";

export type RosterTextViewHandlers = {
  copyToClipboard: () => void;
};

export const RosterTabletopSimView = forwardRef<RosterTextViewHandlers>(
  (_, ref) => {
    const { roster } = useRosterInformation();

    const exportText = roster.warbands
      .filter((warband) => isSelectedUnit(warband.hero))
      .map(({ hero, units }) => {
        const name = tta2mlb[hero.name] ? tta2mlb[hero.name](hero) : hero.name;
        const leader = `(${name}: ${hero.options
          .filter((option) => option.quantity > 0)
          .map((option) => option.name)
          .join(", ")})`;
        const followers = units.filter(isSelectedUnit).map((unit) => {
          const unitName = tta2mlb[unit.name]
            ? tta2mlb[unit.name](unit)
            : unit.name;
          const options = unit.options
            .filter((option) => option.quantity > 0)
            .map((option) => option.name);
          return `    (${unit.quantity}x ${unitName}: ${options})`;
        });
        return followers.length
          ? `${leader}\n${followers.join("\n")}\n`
          : `${leader}\n`;
      })
      .join("\n");

    useImperativeHandle(ref, () => ({
      copyToClipboard: () => {
        window.navigator.clipboard.writeText(exportText);
      },
    }));

    return (
      <>
        <CustomAlert severity="warning" title="">
          The{" "}
          <Link
            href="https://steamcommunity.com/sharedfiles/filedetails/?l=swedish&id=3133220714"
            color="primary"
            target="_blank"
          >
            MESBG FTC Plugin
          </Link>{" "}
          for Tabletop Simulator is based of the model names from Tabletop
          Admiral. Since there will be no 1-to-1 match on unit names it could be
          that some models will fail to load. Please let us know so we can add
          it to our <strong>TTA to MLB</strong> name map.
        </CustomAlert>
        <TextField
          id="outlined-multiline-static"
          fullWidth
          hiddenLabel
          multiline
          rows={16}
          defaultValue={exportText}
          disabled
          size="small"
          sx={{
            mt: 2,
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: (theme) => theme.palette.text.primary, // Needed for some browsers (like Chrome)
              color: (theme) => theme.palette.text.primary,
            },
          }}
        />
      </>
    );
  },
);

/**
 * This is a mapping from the TTA model names extracted from their datafile and the names from
 * our own data file.
 */
const tta2mlb: Record<string, (unit: SelectedUnit) => string> = {
  // Simple name to name mappings
  ...Object.entries(tta2mlbJson)
    .map(([key, value]) => ({ [key]: () => value }))
    .reduce(
      (aggregate, current) => ({
        ...aggregate,
        ...current,
      }),
      {},
    ),

  // Complex mapping including options and quantities.
  "Frodo Baggins": (unit) =>
    unit.army_list === "Garrison of Ithilien"
      ? "Frodo Baggins Garrison of Ithilien"
      : unit.name,
  "Khamul the Easterling": (unit) =>
    unit.profile_origin === "Gundabad & Dol Guldur"
      ? "Nazgul of Dol Guldur (Khamul)"
      : "Khamûl the Easterling",
  "Khandish King": (unit) =>
    unit.model_id === "[variags-of-khand] khandish-king-general"
      ? unit.name + " Leader"
      : unit.name,
  "Moria Blackshield Drum": (unit) =>
    `Moria Blackshield Drummer: )\n    (${unit.quantity}x Moria Blackshield Drum Bearer`,
  "Moria Goblin Drum": (unit) =>
    `Moria Goblin Drum: )\n    (${unit.quantity * 2}x Moria Goblin Drummer`,
  Ringwraith: (unit) => {
    const type = unit.options.find(selectedOptionWithType("ringwraith_amwf"));
    switch (type?.name) {
      case "1A / 0M / 7W / 0F":
        return "Ringwraith A";
      case "2A / 1M / 10W / 1F":
        return "Ringwraith B";
      case "2A / 2M / 14W / 2F":
        return "Ringwraith C";
      default:
        return unit.name;
    }
  },
  "Samwise Gamgee": (unit) =>
    unit.army_list === "Garrison of Ithilien"
      ? "Samwise Gamgee Garrison of Ithilien"
      : unit.name,
  "The Witch-king of Angmar": (unit) => {
    if (unit.profile_origin === "Gundabad & Dol Guldur") {
      return "Nazgul of Dol Guldur (Witch King)";
    }
    const type = unit.options.find(selectedOptionWithType("ringwraith_amwf"));
    switch (type?.name) {
      case "1A / 1M / 10W / 1F":
        return "The Witch-King of Angmar A";
      case "2A / 2M / 14W / 2F":
        return "The Witch-King of Angmar B";
      case "3A / 3M / 18W / 3F":
        return "The Witch-King of Angmar C";
      default:
        return unit.name;
    }
  },
  "Vault Warden Team": (unit) =>
    `Iron Shield Bearer: )\n    (${unit.quantity}x Foe Spear Wielder`,
};

// Below is a list of all the missing names that are present in the TTA dataset.
//   "Meriadoc Brandybuck, Esquire of Rohan",
//   "Meriadoc Brandybuck, Esquire of Rohan",
//   "Meriadoc Brandybuck, Knight of the Mark",
//   "Peregrin Took, Guard of the Citadel",
//   "Peregrin Took, Guard of the Citadel",
