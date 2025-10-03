import { mesbgData } from "../../../assets/data.ts";
import { Roster } from "../../../types/roster";

type Condition = {
  field: string;
  operator: "=" | "<" | ">" | "<=" | ">=" | "!=" | "~";
  value: string | number;
};

export const useRosterSearch = () => {
  const armyData = Object.fromEntries(
    Object.entries(mesbgData).map(([, value]) => [
      value.army_list,
      value.army_type?.replace("(Legacy)", ""),
    ]),
  );

  function getFieldValue(obj: object, path: string): string | number | boolean {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  function parseQuery(query: string): Condition[] {
    const regex = /^([a-zA-Z0-9_.]+)([=<>!]+)(.+)$/;
    return query.split("&").map((part) => {
      const match = part.trim().match(regex);
      if (!match) return { field: "", operator: "~", value: part };
      const [, field, operator, rawValue] = match;
      const value = isNaN(Number(rawValue)) ? rawValue : Number(rawValue);
      return { field, operator: operator as Condition["operator"], value };
    });
  }

  function filterRosters(rosters: Roster[], query: string): Roster[] {
    const conditions = parseQuery(query.toLocaleLowerCase());
    const resolvers = buildResolvers();

    function resolveField(roster: Roster, field: string) {
      if (field in resolvers) return resolvers[field](roster);
      return resolvers.default(roster, field);
    }

    function matchesCondition(roster: Roster, condition: Condition): boolean {
      const fieldValue = resolveField(roster, condition.field);

      // Special handling for arrays
      if (Array.isArray(fieldValue)) {
        switch (condition.operator) {
          case "=":
            return fieldValue.includes(condition.value);
          case "!=":
            return !fieldValue.includes(condition.value);
          default:
            return false; // numeric comparisons don’t apply to arrays
        }
      }

      switch (condition.operator) {
        case "~":
          return fieldValue.includes(condition.value);
        case "=":
          return fieldValue == condition.value;
        case "!=":
          return fieldValue != condition.value;
        case "<":
          return fieldValue < condition.value;
        case ">":
          return fieldValue > condition.value;
        case "<=":
          return fieldValue <= condition.value;
        case ">=":
          return fieldValue >= condition.value;
        default:
          return false;
      }
    }

    return rosters.filter((roster) =>
      conditions.every((cond) => matchesCondition(roster, cond)),
    );
  }

  function buildResolvers() {
    return {
      type: (roster: Roster) => armyData[roster.armyList].toLocaleLowerCase(),
      army: (roster: Roster) => roster.armyList.toLocaleLowerCase(),
      name: (roster: Roster) => roster.name.toLocaleLowerCase(),
      points: (roster: Roster) => roster.metadata.points,
      units: (roster: Roster) => roster.metadata.units,
      bows: (roster: Roster) => roster.metadata.bows,
      throw: (roster: Roster) => roster.metadata.throwingWeapons,
      might: (roster: Roster) => roster.metadata.might,
      will: (roster: Roster) => roster.metadata.will,
      fate: (roster: Roster) => roster.metadata.fate,
      tag: (roster: Roster) =>
        (roster.metadata.tags ?? []).map((tag) => tag.toLocaleLowerCase()),
      "": (roster: Roster) =>
        roster.name.toLocaleLowerCase() +
        "::" +
        roster.armyList.toLocaleLowerCase(),
      default: (roster: Roster, field: string) => getFieldValue(roster, field),
    };
  }

  return { filterRosters };
};
