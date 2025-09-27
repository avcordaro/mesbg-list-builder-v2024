import { MouseEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../../hooks/cloud-sync/useApi.ts";
import { useNewRosterBuilder } from "../../../hooks/new-roster/useNewRosterBuilder.ts";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import { slugify, withSuffix } from "../../../utils/string.ts";
import { SelectedArmyList } from "../../atoms/army-selector/ArmySelectionInput.tsx";

export const useCreateRoster = () => {
  const navigate = useNavigate();
  const { groupId: groupSlug } = useParams();
  const { closeModal } = useAppState();
  const { createRoster, rosters, groups } = useRosterBuildingState();
  const { createRoster: remoteCreate, addRosterToGroup } = useApi();
  const buildNewRoster = useNewRosterBuilder();
  const { id: groupId } =
    groups.find((group) => group.slug === groupSlug) || {};

  const [rosterName, setRosterName] = useState("");
  const [maxRosterPoints, setMaxRosterPoints] = useState("");
  const [armyList, setArmyList] = useState<SelectedArmyList>({
    title: "",
    type: "",
    army: "",
  });

  function updateRosterName(value: string) {
    setRosterName(value);
  }

  function updateMaxRosterPoints(value: string) {
    setMaxRosterPoints(value);
  }

  function fillRosterNameIfEmpty(rosterNameValue: string) {
    if (rosterNameValue) {
      return rosterNameValue;
    }
    const regex = new RegExp(`^${armyList.army} ?(\\(\\d+\\))?$`);
    const matchingRosterNames = rosters
      .filter((roster) => regex.test(roster.name))
      .map((r) => r.name);

    if (matchingRosterNames.length === 0) return `${armyList.army}`;
    const maxNameIndex = Math.max(
      ...matchingRosterNames.map((name) => {
        const matches = name.match(/\((\d+)\)/);
        const index = matches ? matches[1] : "0";
        return parseInt(index);
      }),
    );
    return `${armyList.army} (${maxNameIndex + 1})`;
  }

  function handleCreateNewRoster(
    e: MouseEvent,
    enableSiege?: boolean,
    rosterSiegeRole?: "Attacker" | "Defender",
  ) {
    e.preventDefault();

    if (maxRosterPoints !== "" && Number(maxRosterPoints) <= 0) return;
    if (armyList.army) {
      const rosterNameValue = fillRosterNameIfEmpty(rosterName.trim());
      const newRoster = buildNewRoster({
        id: withSuffix(slugify(rosterNameValue)),
        name: rosterNameValue,
        armyList: armyList.army,
        enableSiege: enableSiege,
        groupId: groupId,
        maximumPoints: maxRosterPoints ? Number(maxRosterPoints) : undefined,
        siegeRole: enableSiege ? rosterSiegeRole : undefined,
        withHero: armyList.hero,
      });

      createRoster(newRoster);
      remoteCreate(newRoster);
      if (groupSlug) addRosterToGroup(groupSlug, newRoster.id);
      navigate(`/roster/${newRoster.id}`, { viewTransition: true });
      closeModal();
    }
  }

  return {
    armyList,
    setArmyList,
    rosterName,
    setRosterName,
    updateRosterName,
    maxRosterPoints,
    setMaxRosterPoints,
    updateMaxRosterPoints,
    handleCreateNewRoster,
  };
};
