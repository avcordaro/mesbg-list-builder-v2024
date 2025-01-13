import {
  Paper,
  Stack,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import html2canvas from "html2canvas";
import { forwardRef, useImperativeHandle, useState } from "react";
import { GiQueenCrown } from "react-icons/gi";

import { armyListData } from "../../../assets/data.ts";
import { useRosterInformation } from "../../../hooks/useRosterInformation.ts";
import { useAppState } from "../../../state/app";
import {
  isSelectedUnit,
  Roster,
  SelectedUnit,
  Warband,
} from "../../../types/roster.ts";
import { ModalTypes } from "../../modal/modals.tsx";
import { AdditionalRules } from "../roster-info/sections/AdditionalRules.tsx";
import { SpecialRules } from "../roster-info/sections/SpecialRules.tsx";
import { getSumOfUnits } from "./totalUnits.ts";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";

const UnitRow = ({
  unit,
  leader,
  rowStyle,
  forceQuantity = false,
}: {
  unit: SelectedUnit;
  leader?: boolean;
  rowStyle: SxProps;
  forceQuantity?: boolean;
}) => {
  return (
    <TableRow sx={rowStyle}>
      <TableCell>
        {(!unit.unit_type.includes("Hero") || forceQuantity) && (
          <>{unit.quantity}x </>
        )}
        {unit.name}{" "}
        {leader && (
          <Typography component="span" variant="body2">
            - <GiQueenCrown /> General
          </Typography>
        )}
      </TableCell>
      <TableCell>
        {unit.options
          .filter((option) => option.quantity > 0)
          .map(
            ({ quantity, max, name }) =>
              `${max > 1 ? `${quantity} ` : ""}${name}`,
          )
          .join(", ")}
      </TableCell>
      <TableCell align="center">{unit.pointsTotal}</TableCell>
    </TableRow>
  );
};

const RosterTotalRows = ({ roster }: { roster: Roster }) => {
  const units = getSumOfUnits(roster);
  const { mode } = useThemeContext();
  return (
    <>
      {units.map((unit) => (
        <UnitRow
          key={unit.id}
          unit={unit}
          rowStyle={{
            backgroundColor: mode === "dark" ? "inherit" : "white",
          }}
          forceQuantity={unit.unit_type.includes("Hero") && unit.quantity > 1}
        />
      ))}
    </>
  );
};

const WarbandRows = ({ warband }: { warband: Warband }) => {
  const { roster } = useRosterInformation();
  const { mode } = useThemeContext();

  const rowStyle: SxProps = {
    backgroundColor:
      mode === "dark"
        ? warband.meta.num % 2 === 0
          ? "#333333"
          : "#3F3F3F"
        : warband.meta.num % 2 === 0
          ? "lightgrey"
          : "white",
  };

  return (
    <>
      <UnitRow
        unit={
          isSelectedUnit(warband.hero)
            ? warband.hero
            : ({
                name: "-- NO HERO SELECTED --",
                unit_type: "Hero of something...",
                options: [],
              } as SelectedUnit)
        }
        leader={
          isSelectedUnit(warband.hero) && roster.metadata.leader === warband.id
        }
        rowStyle={rowStyle}
      />
      {warband.units.filter(isSelectedUnit).map((unit) => (
        <UnitRow key={unit.id} unit={unit} rowStyle={rowStyle} />
      ))}
    </>
  );
};

export type RosterTableViewHandlers = { createScreenshot: () => void };
export type RosterTableViewProps = {
  showArmyBonus: boolean;
  showUnitTotals: boolean;
  includeRosterName: boolean;
};
export const RosterTableView = forwardRef<
  RosterTableViewHandlers,
  RosterTableViewProps
>(({ showArmyBonus, showUnitTotals, includeRosterName }, ref) => {
  const { mode } = useThemeContext();
  const { setCurrentModal } = useAppState();
  const { roster, getAdjustedMetaData } = useRosterInformation();
  const { break_point } = armyListData[roster.armyList];

  const { might, will, fate, units, points, bows, throwingWeapons } =
    getAdjustedMetaData();

  const [screenshotting, setScreenshotting] = useState(false);

  const createScreenshot = () => {
    const rosterList = document.getElementById("rosterTable");
    const admission = document.getElementById("admission");
    if (admission) {
      admission.style.display = "inline-block";
    }

    setScreenshotting(true);
    setTimeout(() => {
      html2canvas(rosterList).then(function (data) {
        setCurrentModal(ModalTypes.ROSTER_SCREENSHOT, {
          screenshot: data.toDataURL(),
          rawScreenshot: data,
          onClose: () => setCurrentModal(ModalTypes.ROSTER_SUMMARY),
        });
        setScreenshotting(false);
      });

      if (admission) {
        admission.style.display = "none";
      }
    });
  };

  useImperativeHandle(ref, () => ({
    createScreenshot: () => createScreenshot(),
  }));

  return (
    <Box
      id="rosterTable"
      sx={
        screenshotting
          ? {
              width: "1200px",
              p: 2,
              backgroundColor: mode === "dark" ? "#2F2F2F" : "inherit",
            }
          : {}
      }
    >
      {includeRosterName && (
        <Divider variant="middle">
          <Typography
            className="middle-earth"
            variant={screenshotting ? "h4" : "h5"}
          >
            {roster.name}
          </Typography>
        </Divider>
      )}
      <Divider variant="middle">
        <Typography
          className="middle-earth"
          variant={screenshotting ? (includeRosterName ? "h5" : "h4") : "h6"}
        >
          {roster.armyList}
        </Typography>
      </Divider>

      <Stack
        sx={{
          mt: 2.5,
          mb: screenshotting ? 4.5 : 2,
        }}
        gap={1}
      >
        {[
          {
            Points: points,
            Units: units,
            Bows: bows,
            "Throwing weapons": throwingWeapons,
          },
          {
            "Break point":
              (units > 0 ? Math.floor(units * (break_point ?? 0.5)) + 1 : 0) +
              " dead",
            Quartered: Math.floor(0.25 * units) + " alive",
            "Might / Will / Fate": `${might} / ${will} / ${fate}`,
          },
        ].map((row, index) => (
          <Stack
            key={index}
            direction="row"
            spacing={1}
            justifyContent="space-between"
            sx={{
              "& *": screenshotting ? { fontSize: "1.5rem !important" } : {},
            }}
          >
            {Object.entries(row).map(([key, value]) => (
              <Typography key={key}>
                <span>{key}:</span> <b>{value}</b>
              </Typography>
            ))}
          </Stack>
        ))}
      </Stack>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table
          sx={{
            width: "100%",
            border: 1,
            borderColor: mode === "dark" ? "#3E3E3E" : "#AEAEAE",
            "& *": screenshotting ? { fontSize: "1.5rem !important" } : {},
            "& th": screenshotting
              ? { fontSize: "1.5rem !important", fontWeight: "bolder" }
              : {},
          }}
          size="small"
        >
          <TableHead>
            <TableRow
              sx={{ backgroundColor: mode === "dark" ? "#3E3E3E" : "white" }}
            >
              <TableCell>Name</TableCell>
              <TableCell>Options</TableCell>
              <TableCell align="center">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showUnitTotals ? (
              <RosterTotalRows roster={roster} />
            ) : (
              <>
                {roster.warbands.map((warband) => (
                  <WarbandRows key={warband.id} warband={warband} />
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showArmyBonus && (
        <Box sx={screenshotting ? { "*": { fontSize: "1.5rem" } } : {}}>
          <AdditionalRules roster={roster} size="dense" />
          <SpecialRules roster={roster} size="dense" />
        </Box>
      )}
      <Typography
        id="admission"
        sx={{
          mt: 2,
          display: "none",
          fontSize: "1.2rem",
          textAlign: "center",
          width: "100%",
        }}
        variant="caption"
      >
        Created with MESBG List Builder (
        <a
          href="#"
          style={{
            textDecoration: "none",
            color: mode === "dark" ? "lightblue" : "inherit",
          }}
        >
          https://mesbg-list-builder.com/
        </a>
        )
      </Typography>
    </Box>
  );
});
