import keywords from "../../../assets/data/keywords.json";
import { useUsedSpecialRules } from "../../../hooks/calculations-and-displays/useUsedSpecialRules.ts";
import { KeywordSearch } from "./KeywordSearch.tsx";

export const SpecialRulesSearch = () => {
  const allSpecialRules = keywords.filter(
    (keyword) => keyword.type === "special_rule",
  );
  const usedSpecialRules = useUsedSpecialRules();

  return (
    <KeywordSearch keywords={allSpecialRules} usedKeywords={usedSpecialRules} />
  );
};
