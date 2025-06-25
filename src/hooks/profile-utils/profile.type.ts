type MagicalPower = { name: string; range: string; cast: string };

type CustomSpecialRule = {
  name: string;
  type: "Active" | "Passive";
  description: string;
};

export type Profile = {
  name: string;

  Mv: string;
  Range?: string;
  Fv: string;
  Sv: string;
  A: string;
  S: string;
  D: string;
  W: string;
  C: string;
  I: string;

  HF?: string | number;
  HM?: string | number;
  HW?: string | number;

  additional_stats?: Profile[];

  additional_text?: string[];
  heroic_actions?: string[];
  special_rules?: string[];

  active_or_passive_rules?: CustomSpecialRule[];

  magic_powers?: MagicalPower[];

  wargear?: string[];
  type?: string;
};
