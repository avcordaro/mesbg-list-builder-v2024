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
  const { createRoster, rosters, groups } = useRosterBuildingState();
  const { createRoster: remoteCreate, addRosterToGroup } = useApi();
  const { id: groupId } =
    groups.find((group) => group.slug === groupSlug) || {};

  const [rosterName, setRosterName] = useState("");
  const [maxRosterPoints, setMaxRosterPoints] = useState("");
  const [goodOrEvil, setGoodOrEvil] = useState("Good");

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
      group: groupId,
      metadata: {
        ...emptyRoster.metadata,
        maxPoints: maxRosterPoints ? Number(maxRosterPoints) : undefined,
        siegeRoster: true,
        siegeRole: "Both",
      },
    };

    createRoster(newRoster);
    remoteCreate(newRoster);
    if (groupSlug) addRosterToGroup(groupSlug, newRoster.id);
    navigate(`/roster/${newRoster.id}`, { viewTransition: true });
    closeModal();
  }

  return {
    rosterName,
    maxRosterPoints,
    goodOrEvil,
    setRosterName,
    setMaxRosterPoints,
    setGoodOrEvil,
    handleCreateNewRoster,
  };
};
