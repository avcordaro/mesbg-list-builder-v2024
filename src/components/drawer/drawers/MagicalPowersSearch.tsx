import keywords from "../../../assets/data/keywords.json";
import { useUsedMagicalPowers } from "../../../hooks/useUsedMagicalPowers.ts";
import { KeywordSearch } from "./KeywordSearch.tsx";

export const MagicalPowersSearch = () => {
  const allMagicalPowers = keywords.filter(
    (keyword) => keyword.type === "magical_power",
  );
  const usedMagicalPowers = useUsedMagicalPowers();

  return (
    <KeywordSearch
      keywords={allMagicalPowers}
      usedKeywords={usedMagicalPowers}
    />
  );
};
