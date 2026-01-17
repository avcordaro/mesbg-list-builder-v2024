import { AdditionalRule } from "./AdditionalRule.tsx";
import { ProfileCardSection } from "./ProfileCardSection";
import { useCard } from "./useCard.ts";

export const ProfileCardAdditionalRules = () => {
  const { additional_rules } = useCard();
  if (!additional_rules) return null;

  return (
    <ProfileCardSection>
      {additional_rules.map((rule, index) => (
        <AdditionalRule index={index} rule={rule} key={index} />
      ))}
    </ProfileCardSection>
  );
};
