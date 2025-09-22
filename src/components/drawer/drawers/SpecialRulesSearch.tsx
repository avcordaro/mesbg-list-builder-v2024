import keywords from "../../../assets/data/keywords.json";
import { useUsedMagicalPowers } from "../../../hooks/calculations-and-displays/useUsedMagicalPowers.ts";
import { useUsedSpecialRules } from "../../../hooks/calculations-and-displays/useUsedSpecialRules.ts";
import { KeywordSearch } from "./KeywordSearch.tsx";

export const SpecialRulesSearch = () => {
  const usedSpecialRules = useUsedSpecialRules();
  const usedMagicalPowers = useUsedMagicalPowers();

  return (
    <KeywordSearch
      keywords={keywords}
      usedKeywords={[...usedSpecialRules, ...usedMagicalPowers]}
    />
  );
};
