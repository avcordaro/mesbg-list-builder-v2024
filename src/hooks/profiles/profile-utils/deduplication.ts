import { Profile } from "./profile.type.ts";

export function duplicateProfiles() {
  return (item: Profile, index: number, self: Profile[]) =>
    index === self.findIndex((other) => other.name === item.name);
}

export function combineProfiles() {
  return (item: Profile, index: number, self: Profile[]) => {
    const firstIndex = self.findIndex((other) => other.name === item.name);
    if (index === firstIndex) return item;

    const firstOccurrence = self[firstIndex];
    const combined = [
      ...firstOccurrence.additional_stats,
      ...item.additional_stats,
    ];
    firstOccurrence.additional_stats = combined.filter(duplicateProfiles());
    return item;
  };
}
