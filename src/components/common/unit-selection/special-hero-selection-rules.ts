import { Unit } from "../../../types/mesbg-data.types.ts";

export function handleBreakingOfTheFellowshipRestriction(unit: Unit) {
  return unit.army_list === "Breaking of the Fellowship"
    ? [
        "[breaking-of-the-fellowship] haldir-galadhrim-captain",
        "[breaking-of-the-fellowship] aragorn-strider",
      ].includes(unit.model_id)
    : true; // defaults to true for non BotF units.
}

export function handleThorinsCompanyRestriction(unit: Unit) {
  return unit.army_list === "Thorin's Company"
    ? [
        "[thorin's-company] gwaihir",
        "[thorin's-company] thorin-oakenshield",
      ].includes(unit.model_id)
    : true;
}

export function handleGarrisonOfIthilien(unit: Unit) {
  return unit.army_list === "Garrison of Ithilien"
    ? ![
        "[garrison-of-ithilien] samwise-gamgee",
        "[garrison-of-ithilien] smeagol",
      ].includes(unit.model_id)
    : true;
}

export function handleArmyOfLakeTown(unit: Unit) {
  return unit.army_list === "Army of Lake-town"
    ? !["[army-of-lake-town] bard's-family"].includes(unit.model_id)
    : true;
}
export function handleSurvivorsOfLakeTown(unit: Unit) {
  return unit.army_list === "Survivors of Lake-town"
    ? !["[survivors-of-lake-town] bard's-family"].includes(unit.model_id)
    : true;
}
export function handleBattleOfTheFiveArmies(unit: Unit) {
  return unit.army_list === "The Battle of Five Armies"
    ? !["[the-battle-of-five-armies] bard's-family"].includes(unit.model_id)
    : true;
}

export function handleAssaultOnRavenhill(unit: Unit) {
  return unit.army_list === "Assault on Ravenhill"
    ? [
        "[assault-on-ravenhill] thorin-oakenshield-king-under-the-mountain",
      ].includes(unit.model_id)
    : true;
}

export function handleBattleOfFornost(unit: Unit) {
  return unit.army_list === "Battle of Fornost"
    ? !["[battle-of-fornost] ranger-of-the-north-ind"].includes(unit.model_id)
    : true;
}

export function handleDefendersOfThePelennor(unit: Unit) {
  return unit.army_list === "Defenders of the Pelennor"
    ? !["[defenders-of-the-pelennor] ranger-of-the-north"].includes(
        unit.model_id,
      )
    : true;
}

export const handleSpecialRestriction = (unit: Unit) => {
  return [
    handleBreakingOfTheFellowshipRestriction,
    handleThorinsCompanyRestriction,
    handleGarrisonOfIthilien,
    handleArmyOfLakeTown,
    handleSurvivorsOfLakeTown,
    handleBattleOfTheFiveArmies,
    handleAssaultOnRavenhill,
    handleBattleOfFornost,
    handleDefendersOfThePelennor,
  ].every((restriction) => restriction(unit));
};
