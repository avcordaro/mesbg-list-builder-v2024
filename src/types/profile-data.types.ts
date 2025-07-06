export type Stats = {
  Mv: string;
  Fv: string;
  Sv: string;
  S: string;
  D: string;
  A: string;
  W: string;
  C: string;
  I: string;
  Range?: string;
};

export type Profile = Stats & {
  active_or_passive_rules?: ActivePassiveRule[];
  magic_powers?: MagicPower[];
  heroic_actions?: string[];
  special_rules?: string[];
  wargear?: string[];
  additional_stats?: AdditionalStat[]; // Optional field to account for the presence of additional stats
  additional_text?: string[]; // Optional field for additional text
};

type ActivePassiveRule = {
  name: string;
  type: "Active" | "Passive"; // Restrict to either "Active" or "Passive"
  description: string;
  option_dependency?: string;
};

type MagicPower = {
  name: string;
  range: string;
  cast: string;
};

type AdditionalStat = Profile & {
  name: string; // name is not part of the Hero, so we explicitly add it
};
