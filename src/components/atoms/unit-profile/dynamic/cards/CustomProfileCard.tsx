import { FunctionComponent } from "react";
import { ProfileCardProps } from "../profile-card/ProfileCard.tsx";
import { CardTemplate } from "./custom/CardTemplate.tsx";
import { GreatBeastOfGorgorothProfileCard } from "./custom/GreatBeastOfGorgorothProfileCard.tsx";
import { SpiderQueenProfileCard } from "./custom/SpiderQueenProfileCard.tsx";
import { ThranduilProfileCard } from "./custom/ThranduilProfileCard.tsx";
import { VaultWardenProfileCard } from "./custom/VaultWardenProfileCard.tsx";
import { WargMarauderProfileCard } from "./custom/WargMarauderProfileCard.tsx";

const customCards: Record<string, FunctionComponent<ProfileCardProps>> = {
  "[dwarven-holds] vault-warden-team": VaultWardenProfileCard,
  "[evil-legacy] great-beast-of-gorgoroth": GreatBeastOfGorgorothProfileCard,
  "[elven-kingdoms] thranduil-king-of-the-woodland-realm": ThranduilProfileCard,
  "[evil-legacy] the-spider-queen": SpiderQueenProfileCard,
  "[evil-legacy] warg-marauder": WargMarauderProfileCard,
};

export const CustomProfileCard: FunctionComponent<ProfileCardProps> = ({
  profile,
}) => {
  const CardComponent = customCards[profile.id];

  return !CardComponent ? (
    <CardTemplate profile={profile} />
  ) : (
    <CardComponent profile={profile} />
  );
};
