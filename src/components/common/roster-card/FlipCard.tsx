import Box from "@mui/material/Box";
import { FunctionComponent, ReactNode, useRef, useState } from "react";
import { CARD_SIZE_IN_PX } from "./RosterSummaryCard.tsx";

type FlipCardProps = {
  front: ReactNode;
  back: ReactNode;
};

export const FlipCard: FunctionComponent<FlipCardProps> = ({ front, back }) => {
  const [flipped, setFlipped] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    timerRef.current = setTimeout(() => setFlipped(true), 500); // long press = 500ms
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <Box
      style={{
        perspective: "1000px",
        width: "100%",
        minWidth: `${CARD_SIZE_IN_PX}px`,
        aspectRatio: "1/1",
      }}
      onMouseEnter={() => setFlipped(true)} // desktop hover
      onMouseLeave={() => setFlipped(false)}
      onTouchStart={handleTouchStart} // mobile long press
      onTouchEnd={handleTouchEnd}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        className="flip-card-inner"
      >
        {/* Front */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
          }}
        >
          {front}
        </div>

        {/* Back */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundColor: (theme) => theme.palette.background.paper,
            color: "white",
          }}
        >
          {back}
        </Box>
      </div>

      <style>
        {`
          .flip-card-inner:hover {
            transform: rotateY(180deg);
          }
        `}
      </style>
    </Box>
  );
};
