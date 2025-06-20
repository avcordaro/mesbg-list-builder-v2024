import { emptyRoster } from "../../state/roster-building/roster";
import { useMandatoryUnits } from "./useMandatoryUnits.ts";
import { useWithSelectedHero } from "./useWithSelectedHero.ts";

type NewRosterArguments = {
  id: string;
  name: string;
  groupId: string;
  armyList: string;
  maximumPoints: number | undefined;
  enableSiege: boolean;
  siegeRole: "Attacker" | "Defender" | undefined;
  withHero: string | undefined;
};

export const useNewRosterBuilder = () => {
  const addMandatoryUnits = useMandatoryUnits();
  const addInitialHero = useWithSelectedHero();

  return function makeNewRoster({
    id,
    name,
    groupId,
    armyList,
    maximumPoints,
    enableSiege,
    siegeRole,
    withHero,
  }: NewRosterArguments) {
    return addInitialHero(
      addMandatoryUnits({
        ...emptyRoster,
        id: id,
        group: groupId,
        name: name,
        armyList: armyList,
        metadata: {
          ...emptyRoster.metadata,
          maxPoints: maximumPoints ? Number(maximumPoints) : undefined,
          siegeRoster: enableSiege,
          siegeRole: enableSiege ? siegeRole : undefined,
        },
      }),
      withHero,
    );
  };
};
