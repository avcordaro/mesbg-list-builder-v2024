import { SelectedUnit } from "../../types/roster.ts";

export function getAdditionalSpecialRules(unit: SelectedUnit) {
  if (unit.name.includes("War Mumak of ")) {
    // All options except the "Mahud Beastmaster Chieftain" should be added to the special rules.
    return unit.options
      .filter(({ quantity }) => quantity)
      .filter(({ name }) => name !== "Mahud Beastmaster Chieftain")
      .map(({ name }) => name);
  }

  if (unit.unit_type === "Siege Engine") {
    const siegeEngineUpgrades = [
      "Flaming Ammunition",
      "Swift Reload",
      "Superior Construction",
      "Severed Heads",
    ];
    return unit.options
      .filter(({ quantity }) => quantity)
      .filter(({ name }) => siegeEngineUpgrades.includes(name))
      .map(({ name }) => name);
  }

  if (
    ["Gandalf the White", "Eowyn", "Treebeard", "Arwen"].includes(unit.name)
  ) {
    if (
      unit.options.find(
        (option) => option.type === "passenger" && option.quantity > 0,
      )
    ) {
      return ["Resistant to Magic"];
    }
  }

  return [];
}
