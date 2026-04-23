import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import { forwardRef, useImperativeHandle } from "react";
import tta2mlbJson from "../../../assets/data/tta2mlb.json";
import { useAppState } from "../../../state/app";
import { isSelectedUnit, Roster, SelectedUnit } from "../../../types/roster.ts";
import { selectedOptionWithType } from "../../../utils/options.ts";
import { CustomAlert } from "../../atoms/alert/CustomAlert.tsx";
import { AlertTypes } from "../../notifications/alert-types.tsx";

export type RosterTextViewHandlers = {
  copyToClipboard: () => void;
};

export type RosterTextViewProps = {
  roster: Roster;
};

const getOptions = ({ options }: SelectedUnit) =>
  options
    .filter((option) => option.quantity > 0)
    .filter((option) => option.type !== "ringwraith_amwf")
    .map((option) => option.tts_name ?? option.name)
    .sort((a, b) => a.localeCompare(b))
    .join(", ");

const getAdditionalIncludes = (roster) => {
  if (roster.armyList === "Kingdom of Khazad-Dum") {
    return "\n(2x Dwarven mirror: )";
  }
  if (roster.armyList === "Army of the Great Eye") {
    return "\n(Great eye marker: )";
  }

  return "";
};

export const RosterTabletopSimView = forwardRef<
  RosterTextViewHandlers,
  RosterTextViewProps
>(({ roster }, ref) => {
  const { triggerAlert } = useAppState();

  const additionalIncludes = getAdditionalIncludes(roster);
  const exportText =
    roster.warbands
      .filter((warband) => isSelectedUnit(warband.hero))
      .map(({ hero, units }) => {
        const name = tta2mlb[hero.name] ? tta2mlb[hero.name](hero) : hero.name;
        const leader =
          hero.unit_type === "Siege Engine"
            ? name
            : `(${name}: ${getOptions(hero)})`;
        const followers = units.filter(isSelectedUnit).map((unit) => {
          const unitName = tta2mlb[unit.name]
            ? tta2mlb[unit.name](unit)
            : unit.name;
          const options = getOptions(unit);
          return `    (${unit.quantity}x ${unitName}: ${options})`;
        });
        return followers.length
          ? `${leader}\n${followers.join("\n")}\n`
          : `${leader}\n`;
      })
      .join("\n") + additionalIncludes;

  useImperativeHandle(ref, () => ({
    copyToClipboard: async () => {
      await window.navigator.clipboard.writeText(exportText);
      triggerAlert(AlertTypes.TTS_TEXT_COPIED_SUCCESS);
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
        that some models will fail to load. Please let us know so we can add it
        to our <strong>TTA to MLB</strong> name map.
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
});

const siegeUnitMappings: Record<string, (unit: SelectedUnit) => string> = {
  Windlance: (unit) =>
    `(Windlance: ${getOptions(unit)})\n    (1x Dale Siege Veteran: )\n    (1x Dale Crew: )`,
  "Gondor Avenger Bolt Thrower": (unit) =>
    `(Gondor Avenger Bolt Thrower: ${getOptions(unit)})\n    (1x Minas Tirith Siege Veteran: )\n    (2x Minas Tirith Siege Crew: )`,
  "Gondor Battlecry Trebuchet": (unit) =>
    `(Gondor Battlecry Trebuchet: ${getOptions(unit)})\n    (1x Minas Tirith Siege Veteran: )\n    (2x Minas Tirith Siege Crew: )`,
  "Dwarven Ballista": (unit) =>
    `(Dwarven Ballista: ${getOptions(unit)})\n    (1x Dwarf Siege Veteran: )\n    (1x Dwarf Siege Crew: )`,
  "Corsair Ballista": (unit) =>
    `(Corsair Ballista: ${getOptions(unit)})\n    (1x Corsair Siege Veteran: )\n    (2x Corsair Siege Crew: )`,
  "Mordor War Catapult": (unit) =>
    `(Mordor War Catapult: ${getOptions(unit)})\n    (1x Mordor Orc Siege Veteran: )\n    (2x Mordor Orc Siege Crew: )\n    (1x Mordor Troll Catapult: )`,
  "Mordor Siege Bow": (unit) =>
    `(Mordor Siege Bow: ${getOptions(unit)})\n    (1x Mordor Orc Siege Veteran: )\n    (2x Mordor Orc Siege Crew: )`,
  "Iron Hills Ballista": (unit) =>
    `(Iron Hills Ballista: ${getOptions(unit)})\n    (1x Iron Hills Dwarf Siege Veteran: )\n    (3x Iron Hills Dwarf Crew: )`,
  "Isengard Assault Ballista": (unit) =>
    `(Isengard Assault Ballista: ${getOptions(unit)})\n    (1x Uruk-hai Siege Veteran: )\n    (2x Uruk-hai Crew: )`,
};

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
  // Siege unit mappings
  ...siegeUnitMappings,

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
