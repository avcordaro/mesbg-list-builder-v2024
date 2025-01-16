import { OptionDependency } from "../../types/mesbg-data.types.ts";
import { useRosterInformation } from "./useRosterInformation.ts";

export const useOptionDependencies = (warbandId: string) => {
  const rosterInformation = useRosterInformation();

  function checkRoster(
    type: "requires-all" | "requires-one" | "requires-none",
    dependencies: string[],
  ): boolean {
    const modelIds = rosterInformation.getSetOfModelIds();
    switch (type) {
      case "requires-all":
        return dependencies.every((model) => modelIds.includes(model));
      case "requires-one":
        return dependencies.some((model) => modelIds.includes(model));
      case "requires-none":
        return !dependencies.some((model) => modelIds.includes(model));
      default:
        return false;
    }
  }

  function checkWarband(
    type: "requires-all" | "requires-one" | "requires-none",
    dependencies: string[],
  ): boolean {
    const modelIds = rosterInformation.getSetOfModelIdsInWarband(warbandId);
    switch (type) {
      case "requires-all":
        return dependencies.every((model) => modelIds.includes(model));
      case "requires-one":
        return dependencies.some((model) => modelIds.includes(model));
      case "requires-none":
        return !dependencies.some((model) => modelIds.includes(model));
      default:
        return false;
    }
  }

  function optionDependency(dependency: OptionDependency) {
    return {
      isMet: (): boolean => {
        switch (dependency.condition) {
          case "in-roster":
            return checkRoster(dependency.type, dependency.dependencies);
          case "in-warband":
            return checkWarband(dependency.type, dependency.dependencies);
          default:
            return true;
        }
      },
    };
  }

  const checkDependency = (d: OptionDependency): boolean =>
    optionDependency(d).isMet();

  return {
    checkDependency,
  };
};
