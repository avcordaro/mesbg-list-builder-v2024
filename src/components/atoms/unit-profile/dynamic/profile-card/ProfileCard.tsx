import Typography from "@mui/material/Typography";
import { createContext, PropsWithChildren } from "react";
import backgroundImage from "../../../../../assets/images/dynamic_card.png";
import { useAppState } from "../../../../../state/app";
import { ModalTypes } from "../../../../modal/modals.tsx";
import { Card } from "./Card.tsx";
import { Profile } from "./types.ts";

export const CardContext = createContext<Profile>(null);

export type ProfileCardProps = {
  profile: Profile;
};

export const ProfileCard = ({
  children,
  profile,
}: PropsWithChildren<Partial<ProfileCardProps>>) => {
  const { setCurrentModal } = useAppState();
  if (!profile) {
    throw new Error("Profile value was unexpectedly empty in <ProfileCard />");
  }
  return (
    <CardContext.Provider value={profile}>
      <Card
        sx={{ backgroundImage: `url(${backgroundImage})`, cursor: "pointer" }}
        className="dynamic-profile-card"
        onClick={() => {
          setCurrentModal(ModalTypes.PROFILE_CARD, {
            title: "Original card",
            unit: { profile_origin: profile.origin, name: profile.profile },
          });
        }}
      >
        {children}
        {profile.book && (
          <Typography
            sx={{
              position: "absolute",
              bottom: 8,
              textAlign: "center",
              width: "100%",
              fontSize: "1rem",
              color: "#999",
            }}
          >
            {profile.book}
          </Typography>
        )}
      </Card>
    </CardContext.Provider>
  );
};
