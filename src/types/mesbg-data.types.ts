export type ArmyType = "Good" | "Evil";

/**
 * TODO: regenerate this list after all 2024 data is loaded.
 */
export type UnitType =
  | "Warrior"
  | "Hero of Legend"
  | "Hero of Valour"
  | "Hero of Fortitude"
  | "Minor Hero"
  | "Independent Hero"
  | "Independent Hero*"
  | "Siege Engine"
  | string;

/**
 * TODO: regenerate this list after all 2024 data is loaded.
 */
type OptionType =
  | "mount"
  | "throw"
  | "bow"
  | "passenger"
  | "mount, throw"
  | "special_warband_upgrade"
  | "ringwraith_amwf"
  | null;

export type OptionDependency = {
  type: "requires-all" | "requires-one";
  condition: "in-warband" | "in-roster";
  dependencies: string[];
};

export type Option = {
  max?: number;
  min?: number;
  quantity?: number;
  name: string;
  id: string;
  points: number;
  type?: OptionType;
  mount_name?: string;
  passengers?: number;
  included?: boolean;
  dependencies?: OptionDependency[];
};

export type Unit = {
  model_id: string;
  army_type: ArmyType;
  army_list: string;
  profile_origin: string;
  name: string;
  unit_type: UnitType;
  base_points: number;
  unique?: boolean;
  siege_crew: number;
  MWFW: string[][];
  warband_size: number;
  options: Option[];
  opt_mandatory?: boolean;
  bow_limit?: boolean;
  default_bow?: boolean;
  default_throw?: boolean;
  inc_bow_count?: boolean;
  no_followers?: boolean;
};
