import data from "../../../../assets/data/profile_data_new.json";
import { ProfileCard } from "./card";
import { Profile } from "./card/types.ts";

interface DynamicCardProps {
  name: string;
  origin: string;
}

export function DynamicCard({ name, origin }: DynamicCardProps) {
  const profileId = slugify(origin, name);
  const profile = data[profileId] as Profile;
  return (
    <ProfileCard profile={profile}>
      <ProfileCard.Header />
      <ProfileCard.Body>
        <ProfileCard.AdditionalRules />
        <ProfileCard.Options />
        <ProfileCard.SpecialRules />
        <ProfileCard.Wargear />
        <ProfileCard.Heroics />
        <ProfileCard.Points />
        <ProfileCard.Magic />
      </ProfileCard.Body>
    </ProfileCard>
  );
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
