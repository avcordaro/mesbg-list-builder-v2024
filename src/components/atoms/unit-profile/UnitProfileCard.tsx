import { FunctionComponent } from "react";
import fallbackCard from "../../../assets/images/default_card.jpg";
import { ImageWithFallback } from "../image/ImageWithFallback.tsx";
import { UnitProfileProps } from "./UnitProfilePicture.tsx";

export const UnitProfileCard: FunctionComponent<
  Pick<UnitProfileProps, "army" | "profile">
> = ({ army, profile }) => {
  return (
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
