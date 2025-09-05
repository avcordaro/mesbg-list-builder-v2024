import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useState } from "react";
import { heroConstraintData } from "../../assets/data.ts";
import { isSelectedUnit } from "../../types/roster.ts";
import { useRosterInformation } from "../calculations-and-displays/useRosterInformation.ts";

export function download(
  content: string,
  fileName: string,
  contentType: string,
) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

export const useDownload = () => {
  const [isDownloading, setDownloading] = useState(false);
  const { roster } = useRosterInformation();

  const downloadProfileCards = async () => {
    setDownloading(true);
    const profileCards = [];
    roster.warbands.map((_warband) => {
      if (_warband.hero) {
        profileCards.push(
          [_warband.hero.profile_origin, _warband.hero.name].join("|"),
        );
        if (
          _warband.hero.unit_type !== "Siege Engine" &&
          heroConstraintData[_warband.hero.model_id]["extra_profiles"].length >
            0
        ) {
          heroConstraintData[_warband.hero.model_id]["extra_profiles"].map(
            (_profile) => {
              profileCards.push(
                [_warband.hero.profile_origin, _profile].join("|"),
              );
              return null;
            },
          );
        }
      }
      _warband.units.filter(isSelectedUnit).map((_unit) => {
        if (_unit.name != null && _unit.unit_type !== "Siege Equipment") {
          profileCards.push([_unit.profile_origin, _unit.name].join("|"));
        }
        return null;
      });
      return null;
    });
    const profileCardsSet = new Set(profileCards);
    const finalProfileCards = [...profileCardsSet];

    const zip = new JSZip();
    for (const card of finalProfileCards) {
      const [origin, profile] = card.split("|");
      const cardUrl = `${RESOURCES_URL}/images/profiles/${encodeURIComponent(origin)}/cards/${encodeURIComponent(profile)}.jpg`;
      const blob = await fetch(cardUrl).then((res) => res.blob());
      zip.file(profile + ".jpg", blob, { binary: true });
    }
    zip.generateAsync({ type: "blob" }).then((blob) => {
      const ts = new Date();
      saveAs(
        blob,
        "MESBG-Army-Profiles-" + ts.toISOString().substring(0, 19) + ".zip",
      );
    });
    setDownloading(false);
  };

  return {
    downloadProfileCards,
    isDownloading,
  };
};
