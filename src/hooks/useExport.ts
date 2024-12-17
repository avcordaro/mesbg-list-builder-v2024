import { mesbgData } from "../assets/data.ts";
import { isSelectedUnit, Roster } from "../types/roster.ts";
import { useCalculator } from "./useCalculator.ts";
import { download } from "./useDownload.ts";
import { useJsonValidation } from "./useJsonValidation.ts";
import { useRosterInformation } from "./useRosterInformation.ts";

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
          tttSpecialUpgrades: roster.metadata.tttSpecialUpgrades,
        },
        warbands: roster.warbands.map((warband) => ({
          id: warband.id,
          hero: warband.hero
            ? {
                id: warband.hero.id,
                model_id: warband.hero.model_id,
                MWFW: warband.hero.MWFW,
                options: warband.hero.options,
                compulsory: warband.hero.compulsory,
              }
            : null,
          units: warband.units.filter(isSelectedUnit).map((unit) => ({
            id: unit.id,
            model_id: unit.model_id,
            MWFW: unit.MWFW,
            options: unit.options,
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
        "warbands[].units[].id",
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

  function rehydrateRoster(uploadedRoster: Partial<Roster>): Roster {
    console.debug("rehydrating roster data from imported json");
    return calculator.recalculateRoster({
      ...uploadedRoster,
      warbands: uploadedRoster.warbands.map(({ id, hero, units, meta }) =>
        calculator.recalculateWarband({
          id: id,
          meta: meta,
          hero: hero
            ? calculator.recalculatePointsForUnit({
                quantity: 1,
                ...mesbgData[hero.model_id],
                ...hero,
              })
            : null,
          units: units.filter(isSelectedUnit).map((unit) =>
            calculator.recalculatePointsForUnit({
              ...mesbgData[unit.model_id],
              ...unit,
            }),
          ),
        }),
      ),
    } as Roster);
  }

  return {
    exportToClipboard: () => {
      window.navigator.clipboard.writeText(convertRosterToJson(roster));
    },
    exportToFile: (fileName: string) =>
      download(convertRosterToJson(roster), fileName, "application/json"),
    importJsonRoster: (jsonString: string) => convertJsonToRoster(jsonString),
  };
};
