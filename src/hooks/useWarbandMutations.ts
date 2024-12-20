import { v4 as randomUuid } from "uuid";
import { AlertTypes } from "../components/alerts/alert-types.tsx";
import { DrawerTypes } from "../components/drawer/drawers.tsx";
import { useAppState } from "../state/app";
import { useRosterBuildingState } from "../state/roster-building";
import { Unit } from "../types/mesbg-data.types.ts";
import {
  FreshUnit,
  isSelectedUnit,
  Roster,
  SelectedUnit,
} from "../types/roster.ts";
import { useCalculator } from "./useCalculator.ts";

export const useWarbandMutations = (rosterId: string, warbandId: string) => {
  const calculator = useCalculator();

  const triggerAlert = useAppState((state) => state.triggerAlert);
  const openSidebar = useAppState((state) => state.openSidebar);
  const updateBuilderSidebar = useRosterBuildingState(
    (state) => state.updateBuilderSidebar,
  );
  const [roster, updateRoster] = useRosterBuildingState(
    (state): [Roster, (roster: Roster) => void] => [
      state.rosters.find(({ id }) => id === rosterId),
      (roster) => {
        state.updateRoster(
          calculator.recalculateRoster({
            ...roster,
            warbands: roster.warbands.map(calculator.recalculateWarband),
          }),
        );
      },
    ],
  );

  function handleHeroSelection(unit: Unit) {
    console.debug(`Select hero for ${warbandId}: ${unit.name}`);
    const points = unit.options
      .filter((o) => o.included)
      .reduce((a, b) => a + b.points * b.quantity, unit.base_points);
    const updatedRoster: Roster = {
      ...roster,
      warbands: roster.warbands.map((wb) =>
        wb.id === warbandId
          ? {
              ...wb,
              hero: {
                ...unit,
                id: randomUuid(),
                pointsPerUnit: points,
                pointsTotal: points,
                quantity: 1,
              },
            }
          : wb,
      ),
    };
    updateRoster(updatedRoster);
  }

  function handleUnitSelection(unitId: string, unit: Unit) {
    console.debug(`Select unit (${unitId}) for ${warbandId}: ${unit.name}`);
    const updatedRoster: Roster = {
      ...roster,
      warbands: roster.warbands.map((wb) => {
        const points = unit.options
          .filter((o) => o.included)
          .reduce((a, b) => a + b.points * b.quantity, unit.base_points);
        return wb.id === warbandId
          ? {
              ...wb,
              units: wb.units.map((u) =>
                u.id === unitId
                  ? {
                      ...unit,
                      id: unitId,
                      pointsPerUnit: points,
                      pointsTotal: points,
                      quantity: 1,
                    }
                  : u,
              ),
            }
          : wb;
      }),
    };
    updateRoster(updatedRoster);
  }

  function addEmptyUnit() {
    console.debug(`Add new empty unit to warband ${warbandId}`);
    const newUnitId = randomUuid();
    const updatedRoster: Roster = {
      ...roster,
      warbands: roster.warbands.map((wb) =>
        wb.id === warbandId
          ? {
              ...wb,
              units: [...wb.units, { id: newUnitId } as FreshUnit],
            }
          : wb,
      ),
    };
    updateRoster(updatedRoster);
    updateBuilderSidebar({
      armyList: rosterId,
      selectionType: "unit",
      selectionFocus: [warbandId, newUnitId],
    });
    openSidebar(DrawerTypes.UNIT_SELECTOR);
  }

  function toggleArmyGeneral(value: boolean) {
    console.debug(`Toggle army general for ${warbandId}: ${value}`);
    const updatedRoster: Roster = {
      ...roster,
      metadata: {
        ...roster.metadata,
        leader: value ? warbandId : null,
      },
    };
    updateRoster(updatedRoster);
  }

  function updateHero(unit: SelectedUnit) {
    console.debug(`Update ${unit.name} (Hero)`);
    const updatedRoster: Roster = {
      ...roster,
      warbands: roster.warbands.map((wb) =>
        wb.id === warbandId
          ? {
              ...wb,
              hero: unit,
            }
          : wb,
      ),
    };
    updateRoster(updatedRoster);
  }

  function updateUnit(unit: SelectedUnit) {
    console.debug(`Update ${unit.name} (Unit)`);
    const updatedRoster: Roster = {
      ...roster,
      warbands: roster.warbands.map((wb) =>
        wb.id === warbandId
          ? {
              ...wb,
              units: wb.units.map((u) => (u.id === unit.id ? unit : u)),
            }
          : wb,
      ),
    };
    updateRoster(updatedRoster);
  }

  function duplicateUnit(unitId: string) {
    console.debug(`Duplicate unit: ${unitId}`);
    const updatedRoster: Roster = {
      ...roster,
      warbands: roster.warbands.map((wb) =>
        wb.id === warbandId
          ? {
              ...wb,
              units: [
                ...wb.units,
                {
                  ...wb.units.find(({ id }) => id === unitId),
                  id: randomUuid(),
                } as SelectedUnit,
              ],
            }
          : wb,
      ),
    };
    updateRoster(updatedRoster);
    triggerAlert(AlertTypes.DUPLICATE_UNIT_SUCCESS);
  }

  function removeUnit(unitId: string) {
    console.debug(`Remove unit: ${unitId}`);
    const updatedRoster: Roster = {
      ...roster,
      warbands: roster.warbands.map((wb) =>
        wb.id === warbandId
          ? {
              ...wb,
              units: wb.units.filter(({ id }) => unitId !== id),
            }
          : wb,
      ),
    };
    updateRoster(updatedRoster);
    triggerAlert(AlertTypes.DELETE_UNIT_SUCCESS);
  }

  function emptyWarband() {
    console.debug(`Empty warband ${warbandId}`);
    const updatedRoster: Roster = {
      ...roster,
      warbands: roster.warbands.map((wb) =>
        wb.id === warbandId ? { ...wb, units: [] } : wb,
      ),
    };
    updateRoster(updatedRoster);
    triggerAlert(AlertTypes.EMPTY_WARBAND_SUCCESS);
  }

  function removeWarband() {
    console.debug(`Remove warband ${warbandId}`);
    const updatedRoster: Roster = {
      ...roster,
      warbands: roster.warbands.filter(({ id }) => id !== warbandId),
    };
    updateRoster(updatedRoster);
    triggerAlert(AlertTypes.DELETE_WARBAND_SUCCESS);
  }

  function duplicateWarband() {
    console.debug(`Duplicate warband ${warbandId}`);
    const warband = roster.warbands.find(({ id }) => id === warbandId);
    const newWarbandId = randomUuid();
    const updatedRoster: Roster = {
      ...roster,
      warbands: [
        ...roster.warbands,
        {
          ...warband,
          id: newWarbandId,
          hero: warband.hero?.unique
            ? null
            : { ...warband.hero, id: randomUuid() },
          units: [
            ...warband.units
              .filter(isSelectedUnit)
              .map((unit) =>
                unit.unique
                  ? { id: randomUuid() }
                  : { ...unit, id: randomUuid() },
              ),
          ],
          meta: {
            ...warband.meta,
            num: roster.warbands.length + 1,
          },
        },
      ],
    };
    updateRoster(updatedRoster);
    triggerAlert(AlertTypes.DUPLICATE_WARBAND_SUCCESS);
  }

  return {
    handleHeroSelection,
    toggleArmyGeneral,
    updateHero,

    addEmptyUnit,
    handleUnitSelection,
    updateUnit,
    duplicateUnit,
    removeUnit,

    removeWarband,
    emptyWarband,
    duplicateWarband,
  };
};
