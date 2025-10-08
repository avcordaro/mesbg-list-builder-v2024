import { DialogContent } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Fragment } from "react";
import { heroConstraintData } from "../../../assets/data.ts";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { useAppState } from "../../../state/app";
import { Unit } from "../../../types/mesbg-data.types.ts";
import { UnitProfileCard } from "../../atoms/unit-profile/UnitProfileCard.tsx";

export const ProfileCardModal = () => {
  const {
    modalContext: { unit },
  } = useAppState();
  const { palette } = useTheme();
  const { isMobile } = useScreenSize();

  const ExtraProfileCards = ({ unit }: { unit: Unit }) => {
    const data = heroConstraintData[unit.model_id];
    if (!data) return null;
    return data.extra_profiles?.map((profile) => (
      <Fragment key={profile}>
        <UnitProfileCard army={unit.profile_origin} profile={profile} />
      </Fragment>
    ));
  };

  return (
    <>
      <DialogContent>
        <Typography variant="body1" textAlign="center" fontWeight="bold">
          Rule texts on these cards are summarized for quick reference. For full
          and official wording, always consult the rulebook.
        </Typography>
        {unit != null && (
          <Box
            sx={{
              maxWidth: isMobile ? "100%" : "900px",
              m: "auto",
            }}
          >
            <UnitProfileCard army={unit.profile_origin} profile={unit.name} />
            <ExtraProfileCards unit={unit} />
          </Box>
        )}
        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          You can download a zip of all profile cards for your current army list
          by clicking on the floating action button in the bottom right, and
          selecting{" "}
          <Typography
            variant="body2"
            component="strong"
            fontWeight={800}
            color={palette.primary.main}
          >
            Download quick reference cards
          </Typography>
        </Typography>
      </DialogContent>
    </>
  );
};
