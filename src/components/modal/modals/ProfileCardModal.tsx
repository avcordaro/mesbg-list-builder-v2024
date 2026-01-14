import CloseIcon from "@mui/icons-material/Close";
import { DialogContent, DialogTitle, FormControlLabel } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Fragment, useState } from "react";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { heroConstraintData } from "../../../assets/data.ts";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { useAppState } from "../../../state/app";
import { Unit } from "../../../types/mesbg-data.types.ts";
import { CustomSwitch } from "../../atoms/switch/CustomSwitch.tsx";
import { UnitProfileCard } from "../../atoms/unit-profile/UnitProfileCard.tsx";

export const ProfileCardModal = () => {
  const {
    modalContext: { unit },
    closeModal,
  } = useAppState();
  const { palette } = useTheme();
  const { isMobile } = useScreenSize();

  const [isDynamicCard, setIsDynamicCard] = useState<boolean>(true);

  const handleToggle = (checked: boolean) => {
    setIsDynamicCard(checked);
  };

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
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexGrow: 1,
            }}
            className="middle-earth"
          >
            <BsFillPersonVcardFill /> {unit.name}
          </Typography>
          <FormControlLabel
            control={
              <CustomSwitch
                name="dynamic-card-toggle"
                checked={isDynamicCard}
                onChange={(_, checked) => handleToggle(checked)}
              />
            }
            label="Dynamic Card"
          />
          <IconButton onClick={closeModal} data-test-id="dialog--close-button">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
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
            <UnitProfileCard
              army={unit.profile_origin}
              profile={unit.name}
              dynamic={isDynamicCard}
            />
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
