import { FunctionComponent } from "react";
import { ProfileCardSection } from "./ProfileCardSection.tsx";
import { useCard } from "./useCard.ts";

export const ProfileCardWargear: FunctionComponent = () => {
  const { wargear } = useCard();
  return (
    <ProfileCardSection title="wargear">
      {wargear.length > 0 ? wargear.join(", ") : "None."}
    </ProfileCardSection>
  );
};
