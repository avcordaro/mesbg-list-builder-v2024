import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import { Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useRosterInformation } from "../../../../hooks/useRosterInformation.ts";
import { isSelectedUnit, Warband } from "../../../../types/roster.ts";

export const WarbandSection = ({
  warband,
  index,
}: {
  warband: Warband;
  index: number;
}) => {
  const {
    roster: {
      metadata: { leader },
    },
  } = useRosterInformation();
  const hero = warband.hero;
  const heroOptions =
    (!!hero &&
      hero.options
        .filter((option) => option.quantity > 0)
        .map((option) => option.name)
        .join(", ")) ||
    "";
  const units = warband.units.filter(isSelectedUnit).map((unit) => ({
    name: unit.name,
    options: unit.options
      .filter((option) => option.quantity > 0)
      .map((option) => option.name)
      .join(", "),
    quantity: unit.unit_type === "Warrior" ? unit.quantity : "",
    points: unit.pointsTotal,
  }));
  const problem = false;

  return (
    <>
      <Stack gap={0.5}>
        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="h6" color="#800000" fontWeight="bold">
            Warband {index}
          </Typography>
          {problem && (
            <ReportProblemRoundedIcon
              sx={{ color: (theme) => theme.palette.warning.main }}
            />
          )}
        </Stack>

        <Stack
          direction="row"
          gap={1}
          justifyContent="space-between"
          sx={{ mb: units.length > 0 ? 2 : 0 }}
        >
          <Typography>
            <strong>
              {hero?.name?.replaceAll("(General)", "")}{" "}
              {leader === warband.id && <i>(General)</i>}
            </strong>{" "}
            <span style={{ whiteSpace: "nowrap" }}>
              {heroOptions && <>with {heroOptions}</>}
            </span>
          </Typography>
          <Typography sx={{ minWidth: "7ch", textAlign: "end" }}>
            <b>{hero?.pointsTotal || 0} pts</b>
          </Typography>
        </Stack>

        {units.map(({ name, options, quantity, points }, index) => (
          <Stack
            key={index}
            direction="row"
            gap={1}
            justifyContent="space-between"
          >
            <Typography>
              <strong>
                {quantity} {name}
              </strong>{" "}
              {options && <>with {options}</>}
            </Typography>
            <Typography sx={{ minWidth: "7ch", textAlign: "end" }}>
              <b>{points} pts</b>
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Divider sx={{ height: 2, bgcolor: "#800000" }} />
    </>
  );
};
