import { useEffect } from "react";
import { mesbgData, siegeEquipmentData } from "../../assets/data.ts";
import { useUserPreferences } from "../../state/preference";
import { useRosterBuildingState } from "../../state/roster-building";
import {
  FreshUnit,
  isSelectedUnit,
  Roster,
  SelectedUnit,
} from "../../types/roster.ts";
import { deepEqual } from "../../utils/objects.ts";
import { useCalculator } from "../calculations-and-displays/useCalculator.ts";
import { useRosterInformation } from "../calculations-and-displays/useRosterInformation.ts";
import { useApi } from "../cloud-sync/useApi.ts";

export const useUpdateRosterVersion = () => {
  const { preferences } = useUserPreferences();
  const { roster } = useRosterInformation();
  const api = useApi();
  const calculator = useCalculator();
  const { updateRoster: updateRosterInState } = useRosterBuildingState();

  const autoUpdate = preferences.autoUpdateUnitData;

  useEffect(() => {
    if (!isOutdatedRoster()) {
      console.debug("Roster on most recent version...");
      return;
    }

    if (!hasChangesInNewVersion()) {
      console.debug("Updating roster version. Roster data remained unchanged.");
      updateRosterInState({
        ...roster,
        version: BUILD_VERSION,
      });
      return;
    }

    if (autoUpdate && hasChangesInNewVersion()) {
      console.debug("Automatically updating roster to new version.");
      updateRoster();
    } else {
      console.debug(
        "Datafiles changed for roster but automatic updates are disabled.",
        roster,
        getUpdatedRoster(),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster.id]);

  // Function overloads.
  function reloadUnit(unit: SelectedUnit): SelectedUnit;
  function reloadUnit(unit: FreshUnit): FreshUnit;
  function reloadUnit(
    unit: FreshUnit | SelectedUnit,
  ): FreshUnit | SelectedUnit {
    if (!isSelectedUnit(unit)) {
      return unit;
    }

    const { model_id, options, quantity, MWFW, ...oldUnit } = unit;

    if (model_id.startsWith("[siege]")) {
      const equipmentData = siegeEquipmentData[model_id];
      return calculator.recalculatePointsForUnit({
        ...oldUnit,
        ...equipmentData,
        MWFW,
        options,
        quantity,
      });
    }

    const modelData = mesbgData[model_id];

    return calculator.recalculatePointsForUnit({
      ...oldUnit,
      ...modelData,
      MWFW,
      options: modelData.options.map((option) => {
        const quantity = options.find(
          (oldOption) =>
            oldOption.name === option.name || oldOption.id === option.id,
        )?.quantity;
        return quantity === undefined ? option : { ...option, quantity };
      }),
      quantity,
    });
  }

  function getUpdatedRoster(): Roster {
    return calculator.recalculateRoster({
      ...roster,
      warbands: roster.warbands.map((warband) => {
        const updatedHero = reloadUnit(warband.hero);
        const updatedUnits = warband.units.map(reloadUnit);

        return calculator.recalculateWarband({
          ...warband,
          hero: updatedHero,
          units: updatedUnits,
        });
      }),
    });
  }

  async function updateRoster() {
    const updatedRoster = getUpdatedRoster();
    updateRosterInState({
      ...updatedRoster,
      version: BUILD_VERSION,
    });
    await api.updateRoster(updatedRoster);
  }

  function hasChangesInNewVersion() {
    return !deepEqual(roster, getUpdatedRoster());
  }

  function isOutdatedRoster() {
    return roster.version !== BUILD_VERSION;
  }

  return {
    isOutdatedRoster,
    updateRoster,
  };
};
