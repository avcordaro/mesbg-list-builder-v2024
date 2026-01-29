import Avatar from "@mui/material/Avatar";
import { FunctionComponent } from "react";
import fallbackLogo from "../../../assets/images/default.png";

export type UnitProfileProps = {
  army: string;
  profile: string;
  size?: "normal" | "smaller" | "large" | number;
  opacity?: number;
};

export const UnitProfilePicture: FunctionComponent<UnitProfileProps> = ({
  army,
  profile,
  size = "normal",
  opacity = 100,
}) => {
  const sizeUnits: number = isNaN(Number(size))
    ? { normal: 100, smaller: 75, large: 150 }[size]
    : (size as number);
  return (
    <Avatar
      alt={`Profile picture for ${profile}`}
      src={
        `${RESOURCES_URL}/images/profiles/` +
        army +
        "/pictures/" +
        profile +
        `.png?version=${BUILD_VERSION}`
      }
      sx={{
        width: sizeUnits,
        height: sizeUnits,
        backgroundColor: "transparent",
        opacity: opacity / 100,
        boxShadow: "0 0 4px 1px rgba(0,0,0,0.3)",
      }}
    >
      <Avatar
        alt={`Profile picture for ${profile}`}
        src={fallbackLogo}
        sx={{
          width: sizeUnits,
          height: sizeUnits,
          backgroundColor: "transparent",
          opacity: opacity / 100,
        }}
      />
    </Avatar>
  );
};
