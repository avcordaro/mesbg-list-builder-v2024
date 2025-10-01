import { MouseEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../../hooks/cloud-sync/useApi.ts";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import { emptyRoster } from "../../../state/roster-building/roster";
import { Roster } from "../../../types/roster.ts";
import { slugify, withSuffix } from "../../../utils/string.ts";

export const useCreateCustomRoster = () => {
  const navigate = useNavigate();
  const { groupId: groupSlug } = useParams();
  const { closeModal } = useAppState();
  const { createRoster, rosters } = useRosterBuildingState();
  const { createRoster: remoteCreate, addRosterToGroup } = useApi();

  const [rosterName, setRosterName] = useState("");
  const [maxRosterPoints, setMaxRosterPoints] = useState("");
  const [goodOrEvil, setGoodOrEvil] = useState("Good");
  const [tags, setTags] = useState([]);

  function fillRosterNameIfEmpty(rosterNameValue: string) {
    if (rosterNameValue) {
      return rosterNameValue;
    }
    const regex = new RegExp(`^Costum: ${goodOrEvil} ?(\\(\\d+\\))?$`);
    const matchingRosterNames = rosters
      .filter((roster) => regex.test(roster.name))
      .map((r) => r.name);

    if (matchingRosterNames.length === 0) return `Custom: ${goodOrEvil}`;
    const maxNameIndex = Math.max(
      ...matchingRosterNames.map((name) => {
        const matches = name.match(/\((\d+)\)/);
        const index = matches ? matches[1] : "0";
        return parseInt(index);
      }),
    );
    return `Custom: ${goodOrEvil} (${maxNameIndex + 1})`;
  }

  function handleCreateNewRoster(e: MouseEvent) {
    e.preventDefault();

    if (maxRosterPoints !== "" && Number(maxRosterPoints) <= 0) return;

    const rosterNameValue = fillRosterNameIfEmpty(rosterName.trim());
    const newRoster: Roster = {
      ...emptyRoster,
      id: withSuffix(slugify(rosterNameValue)),
      name: rosterNameValue,
      armyList: `Custom: ${goodOrEvil}`,
      group: groupSlug,
      metadata: {
        ...emptyRoster.metadata,
        maxPoints: maxRosterPoints ? Number(maxRosterPoints) : undefined,
        siegeRoster: true,
        siegeRole: "Both",
        tags,
      },
    };

    createRoster(newRoster);
    remoteCreate(newRoster).then(() => {
      if (groupSlug) addRosterToGroup(groupSlug, newRoster.id);
    });
    navigate(`/roster/${newRoster.id}`, { viewTransition: true });
    closeModal();
  }

  return {
    rosterName,
    maxRosterPoints,
    goodOrEvil,
    tags,
    setTags,
    setRosterName,
    setMaxRosterPoints,
    setGoodOrEvil,
    handleCreateNewRoster,
  };
};
