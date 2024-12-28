import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import html2canvas from "html2canvas";
import { forwardRef, useImperativeHandle } from "react";
import backgroundCover from "../../../assets/images/roster-summary/background.jpg";
import { useRosterInformation } from "../../../hooks/useRosterInformation.ts";
import { useAppState } from "../../../state/app";
import { isSelectedUnit } from "../../../types/roster.ts";
import { ModalTypes } from "../../modal/modals.tsx";
import { ArmyBonuses } from "./image-view/ArmyBonuses.tsx";
import { HeaderBlock } from "./image-view/HeaderBlock.tsx";
import { WarbandSection } from "./image-view/WarbandSection.tsx";

export type ImageViewViewHandlers = { createScreenshot: () => void };
export type ImageViewViewProps = {
  showArmyBonus: boolean;
  showUnitTotals: boolean;
  includeRosterName: boolean;
};

export const ImageView = forwardRef<ImageViewViewHandlers, ImageViewViewProps>(
  ({ includeRosterName, showArmyBonus }, ref) => {
    const { roster } = useRosterInformation();
    const { setCurrentModal } = useAppState();

    const createScreenshot = () => {
      const rosterList = document.getElementById("rosterImageView");
      const admission = document.getElementById("admission");
      if (admission) {
        admission.style.display = "inline-block";
      }

      setTimeout(() => {
        html2canvas(rosterList).then(function (data) {
          setCurrentModal(ModalTypes.ROSTER_SCREENSHOT, {
            screenshot: data.toDataURL(),
            rawScreenshot: data,
            onClose: () => setCurrentModal(ModalTypes.ROSTER_SUMMARY),
          });
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
      <Box id="rosterImageView" sx={{ p: 0.2 }}>
        <Stack
          sx={{
            px: 4,
            py: 3,
            border: "2px solid #800000",
            backgroundImage: `url(${backgroundCover})`,
            backgroundSize: "cover",
          }}
        >
          <HeaderBlock includeRosterName={includeRosterName} />
          <Divider sx={{ height: 2, bgcolor: "#800000" }} />
          <Stack gap={2} sx={{ py: 2 }}>
            {roster.warbands
              .filter((wb) => isSelectedUnit(wb.hero))
              .map((warband, index) => (
                <WarbandSection
                  warband={warband}
                  key={index}
                  index={index + 1}
                />
              ))}
          </Stack>
          {showArmyBonus && <ArmyBonuses />}
          <Typography
            id="admission"
            sx={{
              mt: 2,
              display: "none",
              textAlign: "center",
              width: "100%",
            }}
            variant="body2"
          >
            Created with MESBG List Builder (
            <a href="#" style={{ textDecoration: "none" }}>
              https://mesbg-list-builder.com
            </a>
            )
          </Typography>
        </Stack>
      </Box>
    );
  },
);
