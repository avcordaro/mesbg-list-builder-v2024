import { useContext } from "react";
import { CardContext } from "./ProfileCard.tsx";

export const useCard = () => {
  const ctx = useContext(CardContext);
  if (!ctx)
    throw new Error("DynamicCard subcomponent must be inside <DynamicCard>");
  return ctx;
};
