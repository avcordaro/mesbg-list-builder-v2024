import { FaFolderOpen } from "react-icons/fa6";
import { icons } from "./icons.tsx";

const FallbackIcon = () => {
  // const { mode } = useThemeContext();
  // return (
  //   <Avatar
  //     alt="default faction logo"
  //     src={fallbackLogo}
  //     sx={{
  //       width: 150,
  //       height: 150,
  //       mb: 2,
  //       display: "inline-block",
  //       backgroundColor: "transparent",
  //       "& .MuiAvatar-img": {
  //         filter: mode === "dark" ? "brightness(0) invert(1)" : "",
  //       },
  //     }}
  //   />
  // );
  return <FaFolderOpen size={100} />;
};

export const GroupIcon = ({ icon }: { icon?: string }) => {
  if (!icon) {
    return <FallbackIcon />;
  }

  const iconComponent = icons[icon];
  if (!iconComponent) {
    return <FallbackIcon />;
  } else {
    return iconComponent;
  }
};
