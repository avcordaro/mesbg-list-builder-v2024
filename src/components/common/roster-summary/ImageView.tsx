import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import * as htmlToImage from "html-to-image";
import { forwardRef, useImperativeHandle, useState } from "react";
import { armyListData } from "../../../assets/data.ts";
import backgroundCover from "../../../assets/images/roster-summary/background.jpg";
import { useAppState } from "../../../state/app";
import { isSelectedUnit, Roster } from "../../../types/roster.ts";
import { ModalTypes } from "../../modal/modals.tsx";
import { WithRibbon } from "../unit-selection/WithRibbon.tsx";
import { ArmyBonuses } from "./image-view/ArmyBonuses.tsx";
import { HeaderBlock } from "./image-view/HeaderBlock.tsx";
import { UnitRow } from "./image-view/UnitRow.tsx";
import { WarbandSection } from "./image-view/WarbandSection.tsx";
import { getSumOfUnits } from "./totalUnits.ts";

export type ImageViewViewHandlers = { createScreenshot: () => void };
export type ImageViewViewProps = {
  roster: Roster;
  showArmyBonus: boolean;
  showUnitTotals: boolean;
  includeRosterName: boolean;
};

export const ImageView = forwardRef<ImageViewViewHandlers, ImageViewViewProps>(
  ({ roster, includeRosterName, showArmyBonus, showUnitTotals }, ref) => {
    const { setCurrentModal } = useAppState();
    const unitTotals = getSumOfUnits(roster);
    const [screenshotting, setScreenshotting] = useState(false);

    const isCustomRoster = ["Custom: Good", "Custom: Evil"].includes(
      roster.armyList,
    );
    const hasLegacyUnits =
      roster.warbands
        .flatMap((wb) => [wb.hero, ...wb.units])
        .filter(isSelectedUnit)
        .filter((unit) => unit.legacy).length > 0;

    const isLegacyArmy = armyListData[roster.armyList].legacy;

    const createScreenshot = () => {
      const rosterList = document.getElementById("rosterImageView");

      setScreenshotting(true);
      setTimeout(() => {
        htmlToImage
          .toPng(rosterList, { skipFonts: true })
          .then((dataUrl) => {
            setCurrentModal(ModalTypes.ROSTER_SCREENSHOT, {
              screenshot: dataUrl,
              onClose: () =>
                setCurrentModal(ModalTypes.ROSTER_SUMMARY, { roster }),
            });
            setScreenshotting(false);
          })
          .catch(alert);
      });
    };

    useImperativeHandle(ref, () => ({
      createScreenshot: () => createScreenshot(),
    }));

    return (
      <Box
        id="rosterImageView"
        sx={screenshotting ? { width: "700px", p: 0.2 } : { p: 0.2 }}
      >
        <WithRibbon
          label={isLegacyArmy ? "Legacy Army" : "Includes Legacy"}
          hideRibbon={!isLegacyArmy && !hasLegacyUnits}
          type="share-image"
        >
          <Stack
            sx={{
              px: 4,
              py: 3,
              border: "2px solid #800000",
              backgroundImage: `url(${backgroundCover})`,
              backgroundSize: "cover",
              color: "#363636",
            }}
          >
            <HeaderBlock
              includeRosterName={includeRosterName}
              roster={roster}
            />
            <Divider sx={{ height: 2, bgcolor: "#800000" }} />
            <Stack gap={2} sx={{ py: 2 }}>
              {!showUnitTotals &&
                roster.warbands
                  .filter((wb) => isSelectedUnit(wb.hero))
                  .map((warband, index) => (
                    <WarbandSection
                      warband={warband}
                      key={index}
                      index={index + 1}
                      leader={roster.metadata.leader}
                      isCustomRoster={isCustomRoster}
                    />
                  ))}
              {showUnitTotals && (
                <Stack gap={0.5}>
                  {unitTotals.map((unit, index) => (
                    <UnitRow
                      key={index}
                      name={unit.name}
                      options={unit.options
                        .filter((option) => option.quantity > 0)
                        .map((option) => option.name)
                        .join(", ")}
                      quantity={unit.quantity}
                      points={unit.pointsTotal}
                      unique={unit.unique}
                      legacy={unit.legacy}
                    />
                  ))}
                  <Divider sx={{ mt: 2, height: 2, bgcolor: "#800000" }} />
                </Stack>
              )}
            </Stack>
            {showArmyBonus && <ArmyBonuses roster={roster} />}
            <Typography
              id="admission"
              sx={{
                mt: 0,
                textAlign: "center",
                width: "100%",
              }}
              variant="body2"
            >
              Created with MESBG List Builder
              <br />
              <a href="#" style={{ textDecoration: "none" }}>
                https://mesbg-list-builder.com
              </a>
            </Typography>
          </Stack>
        </WithRibbon>
      </Box>
    );
  },
);
