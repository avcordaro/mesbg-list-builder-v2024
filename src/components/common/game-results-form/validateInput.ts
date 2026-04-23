import { PastGame } from "../../../state/recent-games/history";
import {
  hasValue,
  isAboveZero,
  isPositiveInteger,
} from "../../../utils/objects.ts";

export function validateFormInput(values: PastGame): string[] {
  const missingFields = [];

  if (!hasValue(values.gameDate)) missingFields.push("Date of the Game");
  if (!isAboveZero(values.points)) missingFields.push("Points");
  if (!hasValue(values.result)) missingFields.push("Match Results");
  if (!hasValue(values.armies)) missingFields.push("Armies");
  if (!hasValue(values.victoryPoints)) missingFields.push("Victory Points");
  if (!hasValue(values.bows) || !isPositiveInteger(values.bows))
    missingFields.push("Bows");
  if (
    !hasValue(values.throwingWeapons) ||
    !isPositiveInteger(values.throwingWeapons)
  )
    missingFields.push("Throwing Weapons");
  if (hasValue(values.duration)) {
    if (!isAboveZero(values.duration)) missingFields.push("Duration");
  }
  if (hasValue(values.opponentName) || hasValue(values.opponentVictoryPoints)) {
    if (!hasValue(values.opponentName)) missingFields.push("Opponent Name");
    if (!hasValue(values.opponentVictoryPoints)) {
      missingFields.push("Opponent's Victory Points");
    }
  }

  return missingFields;
}

export function validateFormInputForStepper({
  armies,
  bows,
  duration,
  scenarioPlayed,
  gameDate,
  opponentArmies,
  opponentVictoryPoints,
  points,
  throwingWeapons,
  victoryPoints,
}: PastGame): string[] {
  const missingFields = [];

  if (!hasValue(gameDate)) missingFields.push("Date of the Game");
  if (!hasValue(duration) || !isAboveZero(duration))
    missingFields.push("Duration");

  if (!hasValue(scenarioPlayed)) missingFields.push("Scenario Played");
  if (!isAboveZero(points)) missingFields.push("Points");

  if (!hasValue(armies)) missingFields.push("Armies");
  if (!hasValue(bows) || !isPositiveInteger(bows)) missingFields.push("Bows");
  if (!hasValue(throwingWeapons) || !isPositiveInteger(throwingWeapons))
    missingFields.push("Throwing Weapons");

  if (!hasValue(opponentArmies)) missingFields.push("Opponent Armies");

  if (!hasValue(victoryPoints)) missingFields.push("Victory Points");
  if (!hasValue(opponentVictoryPoints))
    missingFields.push("Opponent's Victory Points");

  return missingFields;
}

export function findStepWithError({
  armies,
  bows,
  duration,
  scenarioPlayed,
  gameDate,
  opponentArmies,
  opponentVictoryPoints,
  points,
  throwingWeapons,
  victoryPoints,
}: PastGame): number {
  if (!hasValue(gameDate) || !hasValue(duration) || !isAboveZero(duration))
    return 0;

  if (!hasValue(scenarioPlayed) || !isAboveZero(points)) return 1;

  if (
    !hasValue(armies) ||
    !hasValue(bows) ||
    !isPositiveInteger(bows) ||
    !hasValue(throwingWeapons) ||
    !isPositiveInteger(throwingWeapons)
  )
    return 3;

  if (!hasValue(opponentArmies)) return 4;
  if (!hasValue(victoryPoints) || !hasValue(opponentVictoryPoints)) return 6;

  return null;
}
