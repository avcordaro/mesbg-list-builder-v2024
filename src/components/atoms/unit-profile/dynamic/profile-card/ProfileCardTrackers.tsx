import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { CheckboxList } from "../../../trackers/CheckboxList.tsx";
import { useCard } from "./useCard.ts";

const Tracker = ({ label, value }) => {
  if (!value || value === "0") return null;
  console.log(label, value);
  return (
    <Stack flex="1 1 25%" alignItems="center" gap={0.5}>
      <CheckboxList amount={value} mode="light" border={2} />
      <Typography>{label}</Typography>
    </Stack>
  );
};

export const ProfileCardTrackers: FunctionComponent = () => {
  const profile = useCard();
  const { M, W, F, w } = profile.stats;
  return (
    <Stack gap={1} direction="row" flexBasis={1} alignItems="center">
      <Tracker label="Might" value={M} />0 0 25%
      <Tracker label="Will" value={W} />
      <Tracker label="Fate" value={F} />
      <Tracker label="Wounds" value={w} />
    </Stack>
  );
};
