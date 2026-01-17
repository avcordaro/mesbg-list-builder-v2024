import { ProfileCard as Card } from "./ProfileCard.tsx";
import { ProfileCardAdditionalRules } from "./ProfileCardAdditionalRules.tsx";
import { ProfileCardBody } from "./ProfileCardBody.tsx";
import { ProfileCardFooter } from "./ProfileCardFooter.tsx";
import { ProfileCardHeader } from "./ProfileCardHeader.tsx";
import { ProfileCardHeroicActions } from "./ProfileCardHeroicActions.tsx";
import { ProfileCardMagicalPowers } from "./ProfileCardMagicalPowers.tsx";
import { ProfileCardOptions } from "./ProfileCardOptions.tsx";
import { ProfileCardPoints } from "./ProfileCardPoints.tsx";
import { ProfileCardSpecialRules } from "./ProfileCardSpecialRules.tsx";
import { ProfileCardTrackers } from "./ProfileCardTrackers.tsx";
import { ProfileCardWargear } from "./ProfileCardWargear.tsx";

export { EmptyProfileCard } from "./EmptyProfileCard.tsx";

export const ProfileCard = Object.assign(Card, {
  Header: ProfileCardHeader,
  Body: ProfileCardBody,
  Footer: ProfileCardFooter,
  Options: ProfileCardOptions,
  AdditionalRules: ProfileCardAdditionalRules,
  SpecialRules: ProfileCardSpecialRules,
  Wargear: ProfileCardWargear,
  Points: ProfileCardPoints,
  Heroics: ProfileCardHeroicActions,
  Magic: ProfileCardMagicalPowers,
  Trackers: ProfileCardTrackers,
});
