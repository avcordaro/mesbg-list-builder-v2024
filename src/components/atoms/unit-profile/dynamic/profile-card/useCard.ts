import { useContext } from "react";
import { CardContext } from "./ProfileCard.tsx";

export const useCard = () => {
  const ctx = useContext(CardContext);
  if (!ctx)
    throw new Error(
      "ProfileCard subcomponent must be inside a <ProfileCard> component",
    );
  return ctx;
};
