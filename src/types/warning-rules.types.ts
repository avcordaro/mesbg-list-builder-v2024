export type WarningRule = {
  type: "compulsory" | "requires_one" | "requires_all" | "incompatible";
  dependencies: string[];
  warning: string;
};
export type WarningRules = Record<string, WarningRule[]>;
