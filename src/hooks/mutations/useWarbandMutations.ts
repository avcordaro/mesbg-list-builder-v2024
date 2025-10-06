import { v4 as randomUuid } from "uuid";
import { mesbgData } from "../../assets/data.ts";
import { DrawerTypes } from "../../components/drawer/drawers.tsx";
import { AlertTypes } from "../../components/notifications/alert-types.tsx";
import { useAppState } from "../../state/app";
import { useRosterBuildingState } from "../../state/roster-building";
import { emptyWarband as newWarband } from "../../state/roster-building/roster";
import { SiegeEquipment, Unit } from "../../types/mesbg-data.types.ts";
import {
  FreshUnit,
  isSelectedUnit,
  Roster,
  SelectedUnit,
} from "../../types/roster.ts";
import { useCalculator } from "../calculations-and-displays/useCalculator.ts";

import { useRosterSync } from "../cloud-sync/RosterCloudSyncProvider.tsx";

function getBrotherId(unit: Unit, [left, right]: [string, string]) {
  const otherBrotherName = unit.name === left ? right : left;
  const otherBrotherId = unit.model_id.replace(
    /\]\s.*$/,
    `] ${otherBrotherName.toLowerCase()}`,
  );
  return otherBrotherId;
}

function addWarbandWithSpecificUnit(
  updatedRoster: Roster,
  otherBrotherId: string,
) {
  const rosterContainsTheOtherBrother = updatedRoster.warbands
    .map((wb) => wb.hero)
    .filter(isSelectedUnit)
    .map((hero) => hero.model_id)
    .includes(otherBrotherId);

  if (!rosterContainsTheOtherBrother) {
    const otherBrother = mesbgData[otherBrotherId];
    updatedRoster.warbands = [
      ...updatedRoster.warbands,
      {
        ...newWarband,
        id: randomUuid(),
        hero: {
          ...otherBrother,
          id: randomUuid(),
          pointsPerUnit: otherBrother.base_points,
          pointsTotal: otherBrother.base_points,
          quantity: 1,
        },
      },
    ];
  }
}

export const useWarbandMutations = (rosterId: string, warbandId: string) => {
  const calculator = useCalculator();
  const { sync } = useRosterSync();

  const triggerAlert = useAppState((state) => state.triggerAlert);
  const openSidebar = useAppState((state) => state.openSidebar);
  const updateBuilderSidebar = useRosterBuildingState(
    (state) => state.updateBuilderSidebar,
  );
  const [roster, recalculateAndUpdate] = useRosterBuildingState(
    (state): [Roster, (roster: Roster) => void] => [
      state.rosters.find(({ id }) => id === rosterId),
      (roster) => {
        const rosterUpdate = calculator.recalculateRoster({
          ...roster,
          warbands: roster.warbands.map(calculator.recalculateWarband),
        });
        state.updateRoster(rosterUpdate);
        sync(rosterUpdate);
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

    if (["Elladan", "Elrohir"].includes(unit.name)) {
      const otherBrotherId = getBrotherId(unit, ["Elladan", "Elrohir"]);
      addWarbandWithSpecificUnit(updatedRoster, otherBrotherId);
    }

    if (["Murin", "Drar"].includes(unit.name)) {
      const otherBrotherId = getBrotherId(unit, ["Murin", "Drar"]);
      addWarbandWithSpecificUnit(updatedRoster, otherBrotherId);
    }

    recalculateAndUpdate(updatedRoster);
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
    recalculateAndUpdate(updatedRoster);
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
    recalculateAndUpdate(updatedRoster);
    updateBuilderSidebar({
      armyList: rosterId,
      selectionType: "unit",
      selectionFocus: [warbandId, newUnitId],
    });
    openSidebar(DrawerTypes.UNIT_SELECTOR);
  }

  function addSiegeEquipment() {
    console.debug(`Add new siege equipment to warband ${warbandId}`);
    updateBuilderSidebar({
      armyList: rosterId,
      selectionType: "siege",
      selectionFocus: [warbandId, ""],
    });
    openSidebar(DrawerTypes.UNIT_SELECTOR);
  }

  function handleSiegeSelection(equipment: SiegeEquipment) {
    console.debug(`Select siege equipment for ${warbandId}: ${equipment.name}`);
    const updatedRoster: Roster = {
      ...roster,
      warbands: roster.warbands.map((wb) => {
        return wb.id === warbandId
          ? {
              ...wb,
              units: [
                ...wb.units,
                {
                  id: randomUuid(),
                  ...equipment,
                  pointsPerUnit: equipment.base_points,
                  pointsTotal: equipment.base_points,
                  options: [],
                  MWFW: [],
                  quantity: 1,
                },
              ],
            }
          : wb;
      }),
    };
    recalculateAndUpdate(updatedRoster);
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
    recalculateAndUpdate(updatedRoster);
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
    recalculateAndUpdate(updatedRoster);
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
    recalculateAndUpdate(updatedRoster);
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
    recalculateAndUpdate(updatedRoster);
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
    recalculateAndUpdate(updatedRoster);
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
    recalculateAndUpdate(updatedRoster);
    triggerAlert(AlertTypes.EMPTY_WARBAND_SUCCESS);
  }

  function removeWarband() {
    console.debug(`Remove warband ${warbandId}`);
    const updatedRoster: Roster = {
      ...roster,
      warbands: roster.warbands
        .filter(({ id }) => id !== warbandId)
        .map((warband, index) => ({
          ...warband,
          meta: {
            ...warband.meta,
            num: index + 1,
          },
        })),
    };
    recalculateAndUpdate(updatedRoster);
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
    recalculateAndUpdate(updatedRoster);
    triggerAlert(AlertTypes.DUPLICATE_WARBAND_SUCCESS);
  }

  function addNewWarband() {
    const newWarbandId = randomUuid();
    recalculateAndUpdate({
      ...roster,
      warbands: [
        ...roster.warbands,
        {
          ...newWarband,
          id: newWarbandId,
          meta: {
            ...newWarband.meta,
            num: roster.warbands.length + 1,
          },
        },
      ],
    });
    updateBuilderSidebar({
      armyList: rosterId,
      selectionType: "hero",
      selectionFocus: [newWarbandId, null],
    });
    openSidebar(DrawerTypes.UNIT_SELECTOR);
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

    addSiegeEquipment,
    handleSiegeSelection,

    removeWarband,
    emptyWarband,
    addNewWarband,
    duplicateWarband,
  };
};
