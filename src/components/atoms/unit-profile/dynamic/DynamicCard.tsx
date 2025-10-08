import data from "../../../../assets/data/profile_data_new.json";
import { CustomProfileCard } from "./cards/CustomProfileCard.tsx";
import { ManyRulesCard } from "./cards/ManyRulesCard.tsx";
import { RulesAsideCard } from "./cards/RulesAsideCard.tsx";
import { SimpleHeroCard } from "./cards/SimpleHeroCard.tsx";
import { SpecialRulesRightCard } from "./cards/SpecialRulesRightCard.tsx";
import { WargearRightCard } from "./cards/WargearRightCard.tsx";
import { WarriorCard } from "./cards/WarriorCard.tsx";
import { EmptyProfileCard } from "./profile-card";
import { Profile } from "./profile-card/types.ts";

interface DynamicCardProps {
  name: string;
  origin: string;
}

export function DynamicCard({ name, origin }: DynamicCardProps) {
  const profileId = slugify(origin, name);
  const profile = data[profileId] as Profile;

  if (!profile) {
    return (
      <EmptyProfileCard profile={{ profile: name, origin, id: profileId }} />
    );
  }

  switch (profile.card_config.layout) {
    case "warrior":
      return <WarriorCard profile={profile} />;
    case "captain":
      return <SimpleHeroCard profile={profile} />;
    case "rules-aside":
      return <RulesAsideCard profile={profile} />;
    case "rule-heavy":
      return <ManyRulesCard profile={profile} />;

    case "custom-set-1":
      return <WargearRightCard profile={profile} />;
    case "custom-set-2":
      return <SpecialRulesRightCard profile={profile} />;

    case "custom":
      return <CustomProfileCard profile={profile} />;

    default:
      return <EmptyProfileCard profile={profile} />;
  }
}

function slugify(origin: string, profile: string): string {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/,/g, "") // remove commas
      .replace(/&/g, "and") // replace ampersands
      .replace(/\s+/g, "-") // spaces -> hyphens
      .replace(/[^a-z0-9-]/g, "") // remove other non-alphanumeric chars
      .replace(/-+/g, "-") // collapse multiple hyphens
      .replace(/^-|-$/g, ""); // trim leading/trailing hyphens

  const originSlug = normalize(origin);
  const profileSlug = normalize(profile);

  return `[${originSlug}] ${profileSlug}`;
}
