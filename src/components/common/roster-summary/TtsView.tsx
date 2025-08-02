import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import { forwardRef, useImperativeHandle } from "react";
import { useRosterInformation } from "../../../hooks/useRosterInformation.ts";
import { isSelectedUnit, SelectedUnit } from "../../../types/roster.ts";
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
  "Hurin the Tall, Warden of the Keys": () =>
    "Húrin the Tall, Warden of the Keys",
  Irolas: () => "Irolas, Captain of the Guard",
  "Durburz, Goblin-King of Moria": () => "Durbûrz, Goblin-King of Moria",
  "Druzhag the Beastcaller": () => "Drúzhag the Beastcaller",
  "Farmer Maggot": () =>
    "Farmer Maggot: )\n    (1x Fang: )\n    (1x Grip: )\n    (1x Wolf",
  "Uruk-Hai Berserker": () => "Uruk-hai Berserker",
  "Uruk-Hai Warrior": () => "Uruk-hai Warrior",
  "Uruk-Hai Scout": () => "Uruk-hai Scout",
  "Vault Warden Team": (unit) =>
    `Iron Shield Bearer: )\n    (${unit.quantity}x Foe Spear Wielder`,
  "Shank & Wrot": () =>
    `Shank & Wrot, Orc Scavengers: )\n    (1x Shank: )\n    (1x Wrot: )\n    (1x Snow Troll`,
  Grima: () => "Grima Wormtongue",
  Aldor: () => "Aldor, Rohan Archer",
  Arwen: () => "Arwen Undomiel",
  "Aragorn, Strider": () => "Aragorn (Strider)",
  Legolas: () => "Legolas Greenleaf",
  Gimli: () => "Gimli, Son of Gloin",
  "Gandalf the Grey": () => "Gandalf the Grey (Thorin's Company)",
  "The Witch-king of Angmar": (unit) =>
    unit.army_list === "Gundabad & Dol Guldur"
      ? "Nazgul of Dol Guldur (Witch King)"
      : unit.name,
  "Khamul the Easterling": (unit) =>
    unit.army_list === "Gundabad & Dol Guldur"
      ? "Nazgul of Dol Guldur (Khamul)"
      : unit.name,
  "The Dark Headsman": () => "Nazgul of Dol Guldur (Dark Headsman)",
  "The Forsaken": () => "Nazgul of Dol Guldur (The Forsaken)",
  "The Lingering Shadow": () => "Nazgul of Dol Guldur (The Lingering Shadow)",
  "The Abyssal Knight": () => "Nazgul of Dol Guldur (The Abyssal Knight)",
  "The Slayer of Men": () => "Nazgul of Dol Guldur (The Slayer of Men)",
  "Sauron, The Necromancer": () => "Sauron, the Necromancer",
  "Bard's Family": () =>
    `Bard's Family: )\n    (1x Sigrid: )\n    (1x Tilda: )\n    (1x Bain, Son of Bard`,
  "Mahud King": () => "Mahûd King",
  "Mahud Raider": () => "Mahûd Raider",
  "Mahud Tribesmaster": () => "Mahûd Tribesmaster",
  "Mahud Warrior": () => "Mahûd Warrior",
  "Muzgûr, Orc Shaman": () => "Muzgûr, Orc Shaman",
  "Frida Tallspear": () => "Frída Tallspear",
  "Gorulf Ironskin": () => "Gorûlf Ironskin",
  Mauhur: () => "Mauhúr",
  Vrasku: () => "Vraskû",
  Groblog: () => "Gróblog",
  "Dain Ironfoot, King Under the Mountain	": () =>
    "Dáin Ironfoot, King Under the Mountain",
  "Deorwine, Chief of the King's Knights": () =>
    "Déorwine, Chief of the King's Knights",
  "Rumil, Warden of Caras Galadhon": () => "Rúmil, Warden of Caras Galadhon",
  "Ghan-Buri-Ghan": () => "Ghan-buri-Ghan",
  "Mardin, The King's Ward": () => "Mardin, the King's Ward",
  "Durin, King of Khazad-Dum": () => "Durin, King of Khazad-dum",
  "Fraecht, Vassal of the Witch-king": () =>
    "Fraecht, Vassal of the Witch-King",
  Aranarth: () => "Aranarth, First Chieftain of the Dunedain",
  Argadir: () => "Argadir, Captain of Arnor",
  Frealaf: () => "Frealaf, First Marshal of the Riddermark",
  Freca: () => "Freca, Lord of the West March",
  Wulf: () => "Wulf, High Lord of the Hill Tribes",
  Theoden: () => "Theoden, King of Rohan",
  Theodred: () => "Theodred, Prince of Rohan",
  Eomer: () => "Eomer, Marshal of the Riddermark",
  Eowyn: () => "Eowyn, Shieldmaiden of Rohan",
  Gamling: () => "Gamling, Captain of Rohan",
  Gothmog: () => "Gothmog, Lieutenant of Sauron",
  "Mouth of Sauron": () => "The Mouth of Sauron",
  Shagrat: () => "Shagrat, Captain of Cirith Ungol",
  Gorbag: () => "Gorbag, Orc Captain",
  Grishnakh: () => "Grishnakh, Orc Captain",
  Snaga: () => "Snaga, Orc Captain",
  Guritz: () => "Guritz, Master of Reserves",
  "Gil-Galad": () => "Gil-Galad, High King of the Noldor",
  Elrond: () => "Elrond, Master of Rivendell",
  "Ingold, Warden of The Rammas Echor	": () =>
    "Ingold, Warden of the Rammas Echor",
  Lindir: () => "Lindir of Rivendell",
  Cirdan: () => "Cirdan of the Grey Havens",
  "Watcher of Karna": () => "Watcher of Kârna",
  "Feral Uruk-Hai": () => "Feral Uruk-hai",
  "Black Guard of Barad-dur": () => "Black Guard of Barad-dûr",
  "Fredegar 'Fatty' Bolger": () => "Fredegar `Fatty` Bolger",
  "The Master of Lake-town	": () => "Master of Lake-town",
  Madril: () => "Madril, Captain of Ithilien",
  Elendil: () => "Elendil, High King of Gondor and Arnor",
  Isildur: () => "Isildur, Prince of Numenor",
  "Wild Man Oathmaker": () => "The Wild Man Oathmaker",
  Denethor: () => "Denethor, Steward of Gondor",
  "Azog the Defiler": () => "Azog, the Defiler",
  "Grinnah, Goblin Jailer	": () => "Grinnah",
  Faramir: () => "Faramir, Captain of Gondor",
  Saruman: () => "Saruman the White",
  Lurtz: () => "Lurtz, Uruk-hai Scout Captain",
  Ugluk: () => "Ugluk, Uruk-hai Scout Captain",
  Sharku: () => "Sharku, Warg Rider Captain",
  Damrod: () => "Damrod, Ranger of Ithilien",
  "King of the Dead": () => "The King of the Dead",
};

// Below is a list of all the missing names that are present in the TTA dataset.

//   "The Witch-King of Angmar A",
//   "The Witch-King of Angmar B",
//   "The Witch-King of Angmar C",
//   "Ringwraith A",
//   "Ringwraith B",
//   "Ringwraith C",
//   "Khandish King (Leader)",
//   "Great Beast",
//   "Orc Commander (Great Beast)",
//   "Kardûsh the Firecaller",
//   "Khamûl the Easterling",
//   "Múrin",
//   "Drár",
//   "Flói Stonehand",
//   "King's Champion Group",
//   "Herald",
//   "Lothlórien Stormcaller",
//   "Black Númenórean Marshal",
//   "Uruk-hai Shaman",
//   "Fredegar `Fatty` Bolger",
//   "Worm",
//   "Sharkey",
//   "Wild Warg Chieftain Leader",
//   "Meriadoc Brandybuck, Esquire of Rohan",
//   "Mordor Uruk-hai Captain",
//   "Uruk-hai Captain Leader",
//   "Orc Commander",
//   "Mordor Orc Siege Crew",
//   "Mordor Troll (Catapult)",
//   "Orc Crew",
//   "Corsair Siege Crew",
//   "Uruk-hai Crew",
//   "Minas Tirith Siege Crew",
//   "Iron Hills Dwarf Crew",
//   "Dwarf Siege Crew",
//   "Iron Hills Chariot Crew",
//   "Dale Crew",
//   "Troll Brute (Troll)",
//   "Meriadoc Brandybuck, Esquire of Rohan",
//   "Peregrin Took, Guard of the Citadel",
//   "Meriadoc Brandybuck, Knight of the Mark",
//   "Peregrin Took, Guard of the Citadel",
//   "Mordor Troll Chieftain Leader",
//   "Frodo Baggins (Garrison of Ithilien)",
//   "Samwise Gamgee (Garrison of Ithilien)",
//   "Mordor Orc Siege Veteran",
//   "Dale Siege Veteran",
//   "Grimbeorn (Man)",
//   "Grimbeorn the Bear",
//   "Beorn (Man)",
//   "Beorn the Bear",
//   "Corsair Captain Leader",
//   "Royal War Mumak",
//   "Haradrim Commander",
//   "Mumak",
//   "Howdah",
//   "Howdah (Great Beast)",
//   "Uruk-hai Siege Veteran",
//   "Corsair Siege Veteran",
//   "Iron Hills Dwarf Siege Veteran",
//   "Dwarf Siege Veteran",
//   "Mordor Orc Siege Veteran",
//   "Minas Tirith Siege Veteran",
//   "Moria Blackshield Drummer",
//   "Moria Blackshield Drum Bearer",
//   "Broodling",
//   "Moria Goblin Drummer",
