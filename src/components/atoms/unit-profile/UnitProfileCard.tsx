import { FunctionComponent } from "react";
import fallbackCard from "../../../assets/images/default_card.jpg";
import { ImageWithFallback } from "../image/ImageWithFallback.tsx";
import { UnitProfileProps } from "./UnitProfilePicture.tsx";
import { DynamicCard } from "./dynamic/DynamicCard.tsx";

export const UnitProfileCard: FunctionComponent<
  Pick<UnitProfileProps, "army" | "profile"> & { dynamic?: boolean }
> = ({ army, profile, dynamic }) => {
  return dynamic ? (
    <DynamicCard name={profile} origin={army} />
  ) : (
    <ImageWithFallback
      source={
        `${RESOURCES_URL}/images/profiles/` +
        army +
        "/cards/" +
        profile +
        `.jpg?version=${BUILD_VERSION}`
      }
      fallbackImageSource={fallbackCard}
      className="profile_card"
      alt={`Profile card for ${profile}`}
    />
  );
};
