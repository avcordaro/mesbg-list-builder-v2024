import { hasValue } from "../../../utils/objects.ts";

export type Result = "Won" | "Lost" | "Draw";

export const results: Result[] = ["Won", "Lost", "Draw"];

export const calculateResult = (
  vp: string | number,
  ovp: string | number,
  originalResult: Result,
): Result => {
  if (!hasValue(vp) || !hasValue(ovp)) {
    return originalResult;
  }

  const resultList: Record<Result, boolean> = {
    Won: Number(vp) > Number(ovp),
    Draw: Number(vp) === Number(ovp),
    Lost: Number(vp) < Number(ovp),
  };
  return Object.entries(resultList).find(([, value]) => value)[0] as Result;
};
