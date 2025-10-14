import { Tooltip } from "@mui/material";
import profileNotFoundImage from "../../../../../assets/images/default_card.jpg";
import { Card } from "./Card.tsx";
import { Profile } from "./types.ts";

interface EmptyProfileCardProps {
  profile?: Pick<Profile, "profile" | "origin" | "id">;
}

export const EmptyProfileCard = ({ profile }: EmptyProfileCardProps) => (
  <Tooltip
    title={
      <center>
        Profile not found: <br /> {profile.profile} ({profile.origin}) <br />{" "}
        <small style={{ fontStyle: "italic" }}>{profile.id}</small>
      </center>
    }
    arrow={true}
  >
    <Card
      sx={{ backgroundImage: `url(${profileNotFoundImage})` }}
      onClick={() => {
        window.navigator.clipboard.writeText(profile.id);
      }}
    />
  </Tooltip>
);
