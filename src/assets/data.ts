import armyListDataRaw from "./data/army_list_data.json"
import heroConstraintDataRaw from "./data/hero_constraint_data.json"
import keywordsRaw from "./data/keywords.json"
import mesbgDataRaw from "./data/mesbg_data.json"
import siegeEquipmentRaw from "./data/siege_equipment.json"
import profileDataRaw from "./data/profile_data.json"
import warningRulesRaw from "./data/warning_rules.json"

import {ArmyListData} from "../types/army-list-data.types.ts";
import {HeroConstraintsDataType} from "../types/hero-constraints-data.type.ts";
import {KeywordsType} from "../types/keywords.type.ts";
import {SiegeEquipment, Unit} from "../types/mesbg-data.types.ts";
import {Profile} from "../types/profile-data.types.ts";
import {WarningRules} from "../types/warning-rules.types.ts";


export const armyListData: ArmyListData = armyListDataRaw;
export const heroConstraintData: HeroConstraintsDataType = heroConstraintDataRaw;
export const keywords: KeywordsType = keywordsRaw as KeywordsType;
export const mesbgData: Record<string, Unit> = mesbgDataRaw as Record<string, Unit>;
export const siegeEquipmentData: Record<string, SiegeEquipment> = siegeEquipmentRaw as Record<string, SiegeEquipment>;
export const profileData: Record<string, Record<string, Profile>> = profileDataRaw as Record<string, Record<string, Profile>>;
export const warningRulesData: WarningRules = warningRulesRaw as WarningRules;