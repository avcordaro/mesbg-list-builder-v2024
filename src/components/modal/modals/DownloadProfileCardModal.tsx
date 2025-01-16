import {
  Button,
  DialogActions,
  DialogContent,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import hero_constraint_data from "../../../assets/data/hero_constraint_data.json";
import { useRosterInformation } from "../../../hooks/calculations-and-displays/useRosterInformation.ts";
import { useDownload } from "../../../hooks/export/useDownload.ts";
import { useAppState } from "../../../state/app";
import { isSelectedUnit } from "../../../types/roster.ts";
import { AlertTypes } from "../../alerts/alert-types.tsx";
import { CustomAlert } from "../../common/alert/CustomAlert.tsx";
import { UnitProfileCard } from "../../common/images/UnitProfileCard.tsx";

export const DownloadProfileCardModal = () => {
  const { roster } = useRosterInformation();
  const { closeModal, triggerAlert } = useAppState();
  const { downloadProfileCards } = useDownload();
  const [profileCards, setProfileCards] = useState<string[]>([]);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.down("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const profileCards: string[] = [];
    roster.warbands.forEach((warband) => {
      if (warband.hero) {
        profileCards.push(
          [warband.hero.profile_origin, warband.hero.name].join("|"),
        );
        if (
          warband.hero.unit_type !== "Siege Engine" &&
          hero_constraint_data[warband.hero.model_id]["extra_profiles"].length >
            0
        ) {
          hero_constraint_data[warband.hero.model_id]["extra_profiles"].forEach(
            (profile: string) => {
              profileCards.push(
                [warband.hero.profile_origin, profile].join("|"),
              );
            },
          );
        }
      }
      warband.units.filter(isSelectedUnit).forEach((unit) => {
        if (unit.unit_type !== "Siege Equipment") {
          profileCards.push([unit.profile_origin, unit.name].join("|"));
        }
      });
    });
    const profileCardsSet = new Set(profileCards);
    setProfileCards([...profileCardsSet]);
  }, [roster]);

  const handleDownload = async () => {
    downloadProfileCards()
      .catch(() => triggerAlert(AlertTypes.DOWNLOAD_FAILED))
      .finally(closeModal);
  };

  return (
    <>
      <DialogContent>
        <CustomAlert severity="info" title="">
          The following profile cards will be downloaded (in high resolution).
        </CustomAlert>
        <ImageList cols={isMobile ? 1 : isTablet ? 2 : isDesktop ? 3 : 4}>
          {profileCards
            .map((profile) => profile.split("|"))
            .map(([army, profile], index) => (
              <ImageListItem key={index} cols={1}>
                <UnitProfileCard profile={profile} army={army} />
              </ImageListItem>
            ))}
        </ImageList>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="inherit"
          onClick={closeModal}
          sx={{ minWidth: "20ch" }}
          data-test-id="dialog--cancel-button"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          sx={{ minWidth: "20ch" }}
          data-test-id="dialog--submit-button"
        >
          Download
        </Button>
      </DialogActions>
    </>
  );
};
