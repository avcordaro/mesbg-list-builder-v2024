import { v4 as randomUuid } from "uuid";
import { mesbgData, siegeEquipmentData } from "../../assets/data.ts";
import { isSelectedUnit, Roster, SelectedUnit } from "../../types/roster.ts";
import { useCalculator } from "../calculations-and-displays/useCalculator.ts";
import { useRosterInformation } from "../calculations-and-displays/useRosterInformation.ts";
import { download } from "./useDownload.ts";
import { useJsonValidation } from "./useJsonValidation.ts";

export const useExport = () => {
  const { roster } = useRosterInformation();
  const jsonValidation = useJsonValidation();
  const calculator = useCalculator();

  /**
   * This function converts the Roster given to a JSON string removing any values which we can re-add on import. This
   * includes most of the values in the Unit type except for those values that can be altered by user selection.
   *
   * @param roster
   */
  function convertRosterToJson(roster: Roster): string {
    const s = JSON.stringify(
      {
        metadata: {
          leader: roster.metadata.leader,
          leaderCompulsory: roster.metadata.leaderCompulsory,
          tttSpecialUpgrades: roster.metadata.tttSpecialUpgrades,
          siegeRoster: roster.metadata.siegeRoster,
          siegeRole: roster.metadata.siegeRole,
          maxPoints: roster.metadata.maxPoints,
        },
        warbands: roster.warbands.map((warband) => ({
          id: warband.id,
          hero: warband.hero
            ? {
                model_id: warband.hero.model_id,
                MWFW: warband.hero.MWFW,
                options: warband.hero.options
                  .filter((option) => option.quantity > 0)
                  .map(({ id, name, quantity }) => ({ id, name, quantity })),
                compulsory: warband.hero.compulsory,
              }
            : null,
          units: warband.units.filter(isSelectedUnit).map((unit) => ({
            model_id: unit.model_id,
            MWFW: unit.MWFW,
            options: unit.options
              .filter((option) => option.quantity > 0)
              .map(({ id, name, quantity }) => ({ id, name, quantity })),
            quantity: unit.quantity,
          })),
          meta: warband.meta,
        })),
        id: roster.id,
        version: roster.version,
        name: roster.name,
        armyList: roster.armyList,
        edition: "v2024",
      },
      null,
      1,
    );
    return `${s}`;
  }

  /**
   *
   * @param jsonString
   */
  function convertJsonToRoster(
    jsonString: string,
  ): Roster | { error: true; reason: string } {
    try {
      const uploadedRoster: unknown = JSON.parse(jsonString);
      const hasRequiredKeys = jsonValidation.validateKeys(uploadedRoster, [
        "edition",
        "version",
        "id",
        "name",
        "armyList",
        "warbands",
        "warbands[].id",
        "warbands[].units",
        "warbands[].units[].model_id",
        "warbands[].units[].MWFW",
        "warbands[].units[].options",
        "warbands[].units[].quantity",
        "metadata.leader",
      ]);

      if (!hasRequiredKeys) {
        return {
          error: true,
          reason:
            "The export is malformed and is missing some of the required key-value pairs",
        };
      }

      return rehydrateRoster(uploadedRoster);
    } catch (e) {
      console.error(e);
      return {
        error: true,
        reason: `An unknown error has occurred while parsing the provided data, ${e}`,
      };
    }
  }

  const isImported = (importedRoster: Roster): importedRoster is Roster =>
    !!(importedRoster as Roster)?.armyList;

  function hydrateUnit(unit: SelectedUnit, quantity?: number) {
    if (unit.model_id.startsWith("[siege]")) {
      return calculator.recalculatePointsForUnit({
        id: randomUuid(),
        ...siegeEquipmentData[unit.model_id],
        ...unit,
        quantity: quantity ?? unit.quantity,
      });
    }
    const base = mesbgData[unit.model_id];
    const selectedOptions = unit.options.filter(
      (option) => option.quantity > 0,
    );
    return calculator.recalculatePointsForUnit({
      id: randomUuid(),
      ...base,
      ...unit,
      options: base.options.map((option) => {
        const os = selectedOptions.find((o) => o.name === option.name);
        return os ? { ...option, quantity: os.quantity } : option;
      }),
      quantity: quantity ?? unit.quantity,
    });
  }

  function rehydrateRoster(uploadedRoster: Partial<Roster>): Roster {
    console.debug("rehydrating roster data from imported json");

    return calculator.recalculateRoster({
      ...uploadedRoster,
      warbands: uploadedRoster.warbands.map(({ id, hero, units, meta }) =>
        calculator.recalculateWarband({
          id: id,
          meta: meta,
          hero: hero ? hydrateUnit(hero, 1) : null,
          units: [
            ...units.filter(isSelectedUnit).map((unit) => hydrateUnit(unit)),
          ],
        }),
      ),
    } as Roster);
  }

  return {
    convertRosterToJson,
    exportToClipboard: () => {
      window.navigator.clipboard.writeText(convertRosterToJson(roster));
    },
    exportToFile: (fileName: string) =>
      download(convertRosterToJson(roster), fileName, "application/json"),
    importJsonRoster: (jsonString: string) => convertJsonToRoster(jsonString),
    isImported,
  };
};
