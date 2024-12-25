import { ImageList, ImageListItem } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import hero_constraint_data from "../../../../assets/data/hero_constraint_data.json";
import { UnitProfileCard } from "../../../../components/common/images/UnitProfileCard.tsx";
import { useRosterInformation } from "../../../../hooks/useRosterInformation.ts";
import { useScreenSize } from "../../../../hooks/useScreenSize.ts";
import { isSelectedUnit, SelectedUnit } from "../../../../types/roster.ts";

export const ProfileCards = () => {
  const { roster } = useRosterInformation();
  const screen = useScreenSize();
  const [bigCard, setBigCard] = useState(null);

  const getExtraProfilesForHero = (hero: SelectedUnit) => {
    if (!isSelectedUnit(hero)) return [];

    if (hero.unit_type === "Siege Engine") {
      return [];
    }
    const extraProfiles = hero_constraint_data[hero.model_id]["extra_profiles"];

    if (hero.name === "Azog") {
      // Filter the white warg / signal tower if the option is not chosen.
      return extraProfiles
        .filter((profile) =>
          hero.options.find(
            (option) => option.name === profile && option.quantity === 1,
          ),
        )
        .map((profile) => ({
          profile,
          army: hero.profile_origin,
        }));
    }

    if (hero.name === "Treebeard") {
      // Filter Merry & Pippin's profiles if not chosen as passengers.
      const hasMerryPippin = hero.options.find(
        (option) => option.name === "Merry & Pippin" && option.quantity === 1,
      );
      if (hasMerryPippin) {
        return extraProfiles.map((profile) => ({
          profile,
          army: hero.profile_origin,
        }));
      }
      return [];
    }

    return extraProfiles.map((profile) => ({
      profile,
      army: hero.profile_origin,
    }));
  };

  const allProfiles: { profile: string; army: string }[] =
    roster.warbands.flatMap(({ hero, units }) => {
      if (!isSelectedUnit(hero)) return [];
      const heroProfile = { profile: hero.name, army: hero.profile_origin };
      const extraProfiles = getExtraProfilesForHero(hero);
      const unitProfiles = units
        .filter((unit) => isSelectedUnit(unit) && unit.unit_type !== "Siege")
        .map((unit: SelectedUnit) => ({
          profile: unit.name,
          army: unit.profile_origin,
        }));

      return [heroProfile, ...extraProfiles, ...unitProfiles];
    });

  // TODO: sort the profiles...
  const uniqueProfiles = allProfiles.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.profile === item.profile),
  );

  const defaultColums = screen.isMobile ? 2 : screen.isTablet ? 3 : 4;

  return (
    <>
      <center>
        <Typography color="textDisabled" variant="body2">
          Click on one of the cards to enlarge them
        </Typography>
      </center>
      <ImageList cols={defaultColums}>
        {uniqueProfiles.map(({ profile, army }) => (
          <ImageListItem
            key={profile}
            cols={bigCard === profile ? defaultColums : 1}
            onClick={() => {
              setBigCard((prev: string) => (prev !== profile ? profile : null));
            }}
          >
            <UnitProfileCard profile={profile} army={army} />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
};
