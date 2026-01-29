import { FunctionComponent } from "react";
import { ProfileCardSection } from "./ProfileCardSection.tsx";
import { useCard } from "./useCard.ts";

export const ProfileCardSpecialRules: FunctionComponent = () => {
  const { special_rules } = useCard();
  return (
    <ProfileCardSection title="special rules">
      {special_rules.length > 0 ? special_rules.join(", ") : "None."}
    </ProfileCardSection>
  );
};
