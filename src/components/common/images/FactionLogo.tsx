import Avatar from "@mui/material/Avatar";
import { FunctionComponent } from "react";
import fallbackLogo from "../../../assets/images/default.png";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";

export type FactionLogoProps = {
  faction: string;
  size?: number;
};

export const FactionLogo: FunctionComponent<FactionLogoProps> = ({
  faction,
  size = 24,
}) => {
  const { mode } = useThemeContext();
  return (
    <Avatar
      variant="square"
      alt={`${faction} logo`}
      src={
        `${RESOURCES_URL}/images/faction_logos/` +
        faction +
        `.png?version=${BUILD_VERSION}`
      }
      sx={{
        width: size,
        height: size,
        display: "inline-block",
        backgroundColor: "transparent",
        "& .MuiAvatar-img": {
          filter:
            mode === "dark"
              ? "brightness(0.2) invert(1)"
              : "brightness(1.1) saturate(100%) blur(0.2px)",
        },
      }}
    >
      <Avatar
        alt={`${faction} logo`}
        src={fallbackLogo}
        sx={{
          width: size,
          height: size,
          display: "inline-block",
          backgroundColor: "transparent",
        }}
      />
    </Avatar>
  );
};
