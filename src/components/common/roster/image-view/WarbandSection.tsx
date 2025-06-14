import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import { Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { heroConstraintData } from "../../../../assets/data.ts";
import { useRosterInformation } from "../../../../hooks/useRosterInformation.ts";
import {
  isSelectedUnit,
  isSiegeEquipment,
  Warband,
} from "../../../../types/roster.ts";
import { UnitRow } from "./UnitRow.tsx";

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
  const units = Object.values(
    warband.units
      .filter(isSelectedUnit)
      .map((unit) => ({
        name: unit.name,
        options: unit.options
          .filter((option) => option.quantity > 0)
          .map((option) => option.name)
          .join(", "),
        quantity: unit.quantity,
        points: unit.pointsTotal,
        unique: unit.unique,
        legacy: unit.legacy,
      }))
      .reduce(
        (acc, item) => {
          // Create a unique key based on name and options
          const key = `${item.name}_${item.options}`;

          // If the key already exists, update quantity and points
          if (acc[key]) {
            acc[key].quantity += Number(item.quantity);
            acc[key].points += item.points;
          } else {
            // Otherwise, initialize the key with the item data
            acc[key] = item;
          }
          return acc;
        },
        {} as {
          [key: string]: {
            name: string;
            options: string;
            quantity: number;
            points: number;
            unique: boolean;
            legacy: boolean;
          };
        },
      ),
  );

  const overExceededWarbandSize =
    warband.meta.maxUnits !== "-" && warband.meta.units > warband.meta.maxUnits;
  const improperUnits =
    !!hero &&
    warband.units
      .filter(isSelectedUnit)
      .filter((unit) => !isSiegeEquipment(unit))
      .some(
        (unit) =>
          !heroConstraintData[hero.model_id].valid_warband_units.includes(
            unit.model_id,
          ),
      );
  const problem = overExceededWarbandSize || improperUnits;

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
              {hero?.name?.replaceAll("(General)", "")}
              {hero?.legacy ? <sup>&#10013;</sup> : ""}{" "}
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

        {units.map(
          ({ name, options, quantity, points, unique, legacy }, index) => (
            <UnitRow
              key={index}
              name={name}
              options={options}
              quantity={quantity}
              points={points}
              unique={unique}
              legacy={legacy}
            />
          ),
        )}
      </Stack>
      <Divider sx={{ height: 2, bgcolor: "#800000" }} />
    </>
  );
};
