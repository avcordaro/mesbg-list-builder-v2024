import { heroConstraintData, profileData } from "../../assets/data.ts";
import { Option } from "../../types/mesbg-data.types.ts";
import { Profile as RawProfile } from "../../types/profile-data.types.ts";
import { SelectedUnit } from "../../types/roster.ts";
import { selectedOptionWithName } from "../../utils/options.ts";
import { duplicateProfiles } from "./deduplication.ts";
import { Profile } from "./profile.type.ts";

const passenger = ({ type, quantity }: Option) =>
  type === "passenger" && quantity > 0;

function unusedAdditionalStats(
  unit: SelectedUnit,
): (stats: Profile) => boolean {
  return (stats) => {
    if (unit.name.includes("War Mumak of")) {
      const hasChief = !!unit.options.find(
        selectedOptionWithName("Mahud Beastmaster Chieftain"),
      );
      if (stats.name === "Mahud Beastmaster Chieftain") return hasChief;
      if (stats.name === "Haradrim Commander") return !hasChief;
    }

    if (unit.model_id === "[fangorn] treebeard") {
      return !!unit.options.find(passenger);
    }

    if (unit.name === "Gandalf the White") {
      if (stats.name === "Peregrin Took") {
        return !!unit.options.find(selectedOptionWithName("Pippin"));
      }
    }

    if (unit.name === "Azog") {
      if (["The White Warg"].includes(stats.name)) {
        return !!unit.options.find(selectedOptionWithName(stats.name));
      }
    }

    return true;
  };
}

function getAdditionalProfilesFromHeroConstraintsData(
  unit: SelectedUnit,
): Profile[] {
  const extraConstraints = heroConstraintData[unit.model_id];
  if (!extraConstraints) return [];

  return extraConstraints.extra_profiles
    .map((name: string): Profile => {
      const rawProfile: RawProfile | undefined =
        profileData[unit.profile_origin][name];

      if (!rawProfile) return null;
      return { ...rawProfile, name };
    })
    .filter((profile: Profile) => !!profile)
    .filter(unusedAdditionalStats(unit))
    .flatMap((profile: Profile): Profile[] => {
      const extraProfileMWFW = unit.MWFW.find(([mwfName]) =>
        String(mwfName).includes(profile.name),
      );
      if (extraProfileMWFW) {
        const [HM, HW, HF] = extraProfileMWFW[1].split(":");
        return [{ ...profile, HM, HW, HF }];
      }
      return [profile];
    })
    .filter((v) => !!v);
}

/**
 * Get the profiles for the mount listed in the default wargear and chosen options.
 *
 * @param unit
 * @param profile
 */
function getAdditionalProfilesFromMountOptions(
  profile: RawProfile,
  unit: SelectedUnit,
): Profile[] {
  const chosenMounts: Profile[] = unit.options
    ?.filter((option) => option.type === "mount" && option.quantity > 0)
    .filter(
      (option, _, options) =>
        !options.find(
          (other) => other.name === `Upgrade to Armoured ${option.name}`,
        ),
    )
    ?.map((mount) => {
      const name = mount.name.includes("Great Eagle")
        ? "Great Eagle"
        : mount.name;

      const actualName = name.replaceAll("Upgrade to", "").trim();

      const mountMwfw = unit.MWFW.find(([mwfName]) =>
        String(mwfName).includes(actualName),
      ) || ["", "-:-:-:-"];

      const [HM, HW, HF] = mountMwfw[1].split(":");
      return {
        ...profileData.Mounts[actualName],
        name: actualName,
        type: "mount",
        HM,
        HW,
        HF,
      };
    });

  if (!profile.wargear || profile.wargear.length === 0) {
    // if there is no default wargear on the profile, we can short-circuit to only mounts from options.
    return chosenMounts;
  }

  const defaultMounts =
    profile.wargear
      .filter((wargear) => Object.keys(profileData.Mounts).includes(wargear))
      .map((mount) => ({
        ...profileData.Mounts[mount],
        name: mount,
        type: "mount",
      })) || [];

  return [...chosenMounts, ...defaultMounts];
}

/**
 * Get addition profiles listed as part of the original profiles "additional_stats".
 * @param profile
 * @param unit
 */
function getAdditionalProfilesFromProfileData(
  profile: RawProfile,
  unit: SelectedUnit,
) {
  return (
    profile?.additional_stats
      ?.filter(unusedAdditionalStats(unit))
      ?.map((profile) => {
        if (
          unit.name.includes("War Mumak of ") ||
          unit.name === "Great Beast of Gorgoroth"
        ) {
          const riderMwf = unit.MWFW.find(([name]) =>
            String(name).includes(profile.name),
          ) || ["", "-:-:-:-"];
          const [HM, HW, HF] = riderMwf[1].split(":");
          return { ...profile, HM, HW, HF };
        }

        if (
          unit.name === "Iron Hills Chariot (Captain)" &&
          profile.name === "Iron Hills Captain"
        ) {
          const [HM, HW, HF] = unit.MWFW[0][1].split(":");
          return { ...profile, HM, HW, HF };
        }

        return { ...profile };
      }) || []
  );
}

export function getAdditionalStats(
  unit: SelectedUnit,
  profile: RawProfile,
): Profile[] {
  const additionalStats = [];

  additionalStats.push(...getAdditionalProfilesFromProfileData(profile, unit));
  additionalStats.push(...getAdditionalProfilesFromHeroConstraintsData(unit));
  additionalStats.push(...getAdditionalProfilesFromMountOptions(profile, unit));

  return additionalStats.filter(duplicateProfiles());
}
