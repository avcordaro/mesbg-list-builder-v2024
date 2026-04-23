import { SelectedUnit } from "../types/roster.ts";

export const isHeroWhoLeads = (hero: SelectedUnit): boolean => {
  if (hero.name === "Shank & Wrot") return false;
  if (hero.name === "Smaug") return false;

  return (
    !["Independent Hero", "Independent Hero*", "Siege Engine"].includes(
      hero.unit_type,
    ) && hero.no_followers !== true
  );
};
