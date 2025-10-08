export type Profiles = Record<string, Profile>;

export type Profile = {
  id: string;
  origin: string;
  profile: string;
  points: number;
  keywords: string[];
  special_rules: string[];
  options: Option[];
  stats: Stats;
  wargear: string[];

  // Optional arrays (omitted when empty)
  heroic_actions?: string[];
  magical_powers?: MagicalPower[];
  additional_rules?: SpecialRule[];
  additional_stats?: string[];
  additional_text?: string[];
};

export type SpecialRule = {
  name: string;
  type: string;
  description: string;
};

export type MagicalPower = {
  name: string;
  range: string;
  cast: string;
};

export type Option = {
  name: string;
  points: number;
};

export type Stats = {
  mv?: string;
  fv?: string;
  sv?: string;
  s?: string;
  d?: string;
  a?: string;
  w?: string;
  c?: string;
  i?: string;
  M?: string;
  W?: string;
  F?: string;
  range?: string;
};
