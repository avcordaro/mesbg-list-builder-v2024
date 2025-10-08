import { Box } from "@mui/material";
import styled from "@mui/material/styles/styled";
import { createContext, PropsWithChildren } from "react";
import profileNotFoundImage from "../../../../../assets/images/default_card.jpg";
import backgroundImage from "../../../../../assets/images/dynamic_card.png";
import { Profile } from "./types.ts";

const Card = styled(Box)(() => ({
  position: "relative",
  width: "24cm",
  padding: "2.5rem",
  aspectRatio: 1.484,
  backgroundSize: "cover",
  backgroundPosition: "center",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  border: "1px solid rgb(243 231 215)",
  margin: "0.5rem",
  borderRadius: "1rem",
  boxShadow: "rgba(0, 0, 0, 0.2) 0 5px 5px",
  color: "black",
}));

export const CardContext = createContext<Profile | null>(null);

type ProfileCardProps = {
  profile: Profile;
};

export const ProfileCard = ({
  children,
  profile,
}: PropsWithChildren<Partial<ProfileCardProps>>) => {
  return profile ? (
    <CardContext.Provider value={profile}>
      <Card sx={{ backgroundImage: `url(${backgroundImage})` }}>
        {children}
      </Card>
    </CardContext.Provider>
  ) : (
    <Card sx={{ backgroundImage: `url(${profileNotFoundImage})` }} />
  );
};
