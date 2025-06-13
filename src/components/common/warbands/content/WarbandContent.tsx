import { Draggable, Droppable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import { Button, ButtonGroup } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { useRosterInformation } from "../../../../hooks/useRosterInformation.ts";
import { useWarbandMutations } from "../../../../hooks/useWarbandMutations.ts";
import { useAppState } from "../../../../state/app";
import { useRosterBuildingState } from "../../../../state/roster-building";
import { Unit } from "../../../../types/mesbg-data.types.ts";
import { isSelectedUnit, Warband } from "../../../../types/roster.ts";
import { isHeroWhoLeads } from "../../../../utils/hero.ts";
import { DrawerTypes } from "../../../drawer/drawers.tsx";
import { ModalTypes } from "../../../modal/modals.tsx";
import { HeroCard } from "../../card/HeroCard.tsx";
import { SelectUnitCardButton } from "../../card/SelectUnitCardButton.tsx";
import { WarriorCard } from "../../card/WarriorCard.tsx";
import { WithRibbon } from "../../unit-selection/WithRibbon.tsx";

export type WarbandContentProps = {
  warband: Pick<Warband, "id" | "hero" | "units" | "meta">;
  collapsed: boolean;
};

export const WarbandContent: FunctionComponent<WarbandContentProps> = ({
  warband: {
    id: warbandId,
    hero,
    units,
    meta: { num: warbandNum },
  },
  collapsed,
}) => {
  const { rosterId: armyId } = useParams();
  const mutations = useWarbandMutations(armyId, warbandId);
  const { openSidebar, setCurrentModal } = useAppState();
  const { updateBuilderSidebar } = useRosterBuildingState();
  const isWarbandWithLeader = !!useRosterBuildingState(({ rosters }) =>
    rosters.find(
      ({ id, metadata: { leader } }) => id === armyId && leader === warbandId,
    ),
  );
  const { getAdjustedMetaData } = useRosterInformation();
  const { siegeRoster } = getAdjustedMetaData();

  function openHeroPicker() {
    console.debug("Open Hero Picker");
    updateBuilderSidebar({
      armyList: armyId,
      selectionType: "hero",
      selectionFocus: [warbandId, null],
    });
    openSidebar(DrawerTypes.UNIT_SELECTOR);
  }

  function openUnitPicker(unitId: string) {
    console.debug(`Open Unit Picker`);
    updateBuilderSidebar({
      armyList: armyId,
      selectionType: "unit",
      selectionFocus: [warbandId, unitId],
    });
    openSidebar(DrawerTypes.UNIT_SELECTOR);
  }

  function openProfileCard(unit: Unit) {
    console.debug(`Open profile card for ${unit.profile_origin}/${unit.name}`);
    setCurrentModal(ModalTypes.PROFILE_CARD, {
      unit: unit,
      title: unit.name,
    });
  }

  return (
    <Stack sx={{ p: 1 }} gap={1}>
      {isSelectedUnit(hero) ? (
        <WithRibbon label="Legacy" hideRibbon={!hero.legacy}>
          <HeroCard
            unit={hero}
            warbandId={warbandId}
            warbandNum={warbandNum}
            index={0}
            updateUnit={mutations.updateHero}
            openProfileCard={() => openProfileCard(hero)}
            reselect={openHeroPicker}
            isLeader={isWarbandWithLeader}
            toggleLeader={mutations.toggleArmyGeneral}
            collapsed={collapsed}
          />
        </WithRibbon>
      ) : (
        <SelectUnitCardButton
          title="Select a hero"
          onClick={openHeroPicker}
          warbandNum={warbandNum}
          index={0}
          collapsed={collapsed}
        />
      )}

      <Droppable
        droppableId={warbandId}
        type="unit"
        isDropDisabled={!hero || !isHeroWhoLeads(hero)}
      >
        {(droppable, droppableSnapshot) => (
          <Stack
            ref={droppable.innerRef}
            {...droppable.droppableProps}
            spacing={1}
            sx={
              droppableSnapshot.isDraggingOver
                ? {
                    backgroundColor: "#FFFFFF33",
                    border: "1px dashed white",
                    p: 1,
                    transition: "padding 0.3s ease",
                  }
                : {
                    transition: "padding 0.3s ease",
                  }
            }
          >
            {units.map((unit, index) => (
              <Draggable key={unit.id} draggableId={unit.id} index={index}>
                {(draggable, draggableSnapshot) => (
                  <Box
                    ref={draggable.innerRef}
                    {...draggable.draggableProps}
                    {...draggable.dragHandleProps}
                    data-scroll-id={unit.id}
                  >
                    <Box
                      sx={[
                        { transition: "padding 0.3s ease" },
                        draggableSnapshot.isDragging ? { p: 3 } : {},
                      ]}
                    >
                      <Box
                        sx={
                          draggableSnapshot.isDragging
                            ? {
                                transform: "rotate(1.5deg)",
                                boxShadow: "1rem 1rem 1rem #00000099",
                                transition:
                                  "transform 0.3s ease, boxShadow 0.3s ease",
                              }
                            : {
                                transition:
                                  "transform 0.3s ease, boxShadow 0.3s ease",
                              }
                        }
                      >
                        {!isSelectedUnit(unit) ? (
                          <SelectUnitCardButton
                            title="Select a unit"
                            onClick={() => openUnitPicker(unit.id)}
                            warbandNum={warbandNum}
                            remove={() => mutations.removeUnit(unit.id)}
                            index={index + 1} // +1 offset for the warband captain.
                            collapsed={collapsed}
                          />
                        ) : (
                          <WithRibbon label="Legacy" hideRibbon={!unit.legacy}>
                            {unit.unit_type.includes("Hero") ? (
                              <HeroCard
                                unit={unit}
                                followerOf={hero?.model_id}
                                warbandId={warbandId}
                                warbandNum={warbandNum}
                                index={index + 1} // +1 offset for the warband captain.
                                updateUnit={mutations.updateUnit}
                                openProfileCard={() => openProfileCard(unit)}
                                reselect={() => openUnitPicker(unit.id)}
                                remove={() => mutations.removeUnit(unit.id)}
                                collapsed={collapsed}
                              />
                            ) : (
                              <WarriorCard
                                unit={unit}
                                followerOf={hero?.model_id}
                                warbandId={warbandId}
                                warbandNum={warbandNum}
                                index={index + 1} // +1 offset for the warband captain.
                                openProfileCard={() => openProfileCard(unit)}
                                updateUnit={(updatedUnit) =>
                                  mutations.updateUnit(updatedUnit)
                                }
                                duplicate={() =>
                                  mutations.duplicateUnit(unit.id)
                                }
                                remove={() => mutations.removeUnit(unit.id)}
                                reselect={() => openUnitPicker(unit.id)}
                                collapsed={collapsed}
                              />
                            )}
                          </WithRibbon>
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Draggable>
            ))}
            {droppable.placeholder}
          </Stack>
        )}
      </Droppable>

      {hero && isHeroWhoLeads(hero) && (
        <>
          {siegeRoster ? (
            <ButtonGroup>
              <Button
                onClick={() => mutations.addEmptyUnit()}
                variant="contained"
                color="primary"
                fullWidth
                endIcon={<AddIcon />}
                data-test-id={`warband-${warbandNum}--add-unit`}
              >
                Add Unit
              </Button>
              <Button
                onClick={() => mutations.addSiegeEquipment()}
                variant="contained"
                color="inherit"
                fullWidth
                endIcon={<AddIcon />}
                data-test-id={`warband-${warbandNum}--add-siege-equipment`}
              >
                Add Siege Equipment
              </Button>
            </ButtonGroup>
          ) : (
            <Button
              onClick={() => mutations.addEmptyUnit()}
              variant="contained"
              color="primary"
              fullWidth
              endIcon={<AddIcon />}
              data-test-id={`warband-${warbandNum}--add-unit`}
            >
              Add Unit
            </Button>
          )}
        </>
      )}
    </Stack>
  );
};
