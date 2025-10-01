import { FunctionComponent } from "react";
import { armyListData } from "../../../assets/data.ts";
import { isSelectedUnit, Roster } from "../../../types/roster.ts";
import { Link } from "../../atoms/link/Link.tsx";
import { FlipCard } from "./FlipCard.tsx";
import { RosterCardBack } from "./RosterCardBack.tsx";
import { RosterCardFront } from "./RosterCardFront.tsx";

export const CARD_SIZE_IN_PX = 300;

export type RosterSummaryCardProps = {
  roster: Roster;
  isDeleting?: boolean;
  isMarkedForDeletion?: boolean;
  markForDeletion: () => void;
};

export const RosterSummaryCard: FunctionComponent<RosterSummaryCardProps> = ({
  roster,
  isDeleting,
  markForDeletion,
  isMarkedForDeletion,
}) => {
  const isLegacy =
    armyListData[roster.armyList]?.legacy ||
    !!roster.warbands
      .flatMap((wb) => [wb.hero, ...wb.units])
      .filter(isSelectedUnit)
      .find((unit) => unit.legacy);

  return (
    <Link
      to={`/roster/${roster.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
      data-test-id={"rosters--" + roster.id + "--link"}
      onClick={(e) => {
        if (isDeleting) {
          e.preventDefault();
          markForDeletion();
        }
      }}
    >
      <FlipCard
        front={
          <RosterCardFront
            roster={roster}
            legacy={isLegacy}
            markedForDeletion={isMarkedForDeletion}
          />
        }
        back={
          <RosterCardBack
            roster={roster}
            markedForDeletion={isMarkedForDeletion}
          />
        }
      />
    </Link>
  );
};
