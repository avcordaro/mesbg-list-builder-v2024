import { CategoryOutlined } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { heroConstraintData } from "../../../assets/data.ts";
import { useCalculator } from "../../../hooks/useCalculator.ts";
import { useCollectionWarnings } from "../../../hooks/useCollectionWarnings.ts";
import { useMwfMutations } from "../../../hooks/useMwfMutations.ts";
import { useOptionDependencies } from "../../../hooks/useOptionDependencies.ts";
import { useRosterInformation } from "../../../hooks/useRosterInformation.ts";
import { useScreenSize } from "../../../hooks/useScreenSize.ts";
import { Option } from "../../../types/mesbg-data.types.ts";
import { SelectedUnit } from "../../../types/roster.ts";
import { slugify } from "../../../utils/string.ts";
import { LeaderToggle } from "../army-leader/LeaderToggle.tsx";
import { UnitProfilePicture } from "../images/UnitProfilePicture.tsx";
import { MwfBadge } from "../might-will-fate/MwfBadge.tsx";
import { OptionList } from "../option/OptionList.tsx";
import { UnitTypeLabel } from "../unit-type/UnitTypeLabel.tsx";
import { CardActionButtons } from "./CardActionButtons.tsx";
import { invalidUnitSelectionBackgroundTint } from "./WarriorCard.tsx";

export type HeroCardProps = {
  unit: SelectedUnit;
  followerOf?: string;
  warbandId: string;
  warbandNum: number;
  index: number;
  collapsed?: boolean;
  isLeader?: boolean;
  toggleLeader?: (value: boolean) => void;
  updateUnit: (updatedUnit: SelectedUnit) => void;
  openProfileCard: () => void;
  reselect: () => void;
  remove?: () => void;
};

export const HeroCard: FunctionComponent<HeroCardProps> = ({
  unit,
  followerOf,
  warbandId,
  warbandNum,
  index,
  updateUnit,
  isLeader = false,
  toggleLeader,
  openProfileCard,
  reselect,
  remove,
  collapsed,
}) => {
  const calculator = useCalculator();
  const { checkDependency } = useOptionDependencies(warbandId);
  const { roster, getSetOfModelIds } = useRosterInformation();
  const screen = useScreenSize();
  const mwf = useMwfMutations();
  const { warnings, available, selected, overExceededCollection } =
    useCollectionWarnings(unit);

  const valid =
    !followerOf ||
    heroConstraintData[followerOf].valid_warband_units.includes(unit.model_id);

  const selectedOptions = unit.options
    .filter((option) => option.included !== true)
    .filter((option) => option.quantity > 0)
    .map((option) => option.name)
    .join(", ")
    .replace(/,(?=[^,]*$)/, " &");

  function updateOptions(options: Option[]) {
    console.debug("Update hero options.", { options });
    updateUnit(
      calculator.recalculatePointsForUnit({
        ...unit,
        MWFW: mwf.hasSpecialMwfRules(unit)
          ? mwf.handleSpecialMwfForUnit(unit, options)
          : unit.MWFW,
        options: options,
      }),
    );
  }

  function getOptionsForUnit(): (Option & { selectable?: boolean })[] {
    return unit.options
      .filter((option, _, self) => {
        if (!option.dependencies || option.dependencies.length === 0)
          return option;

        const optionAvailable = option.dependencies.some(checkDependency);
        if (!optionAvailable && option.quantity > 0) {
          // removing the option from the selected options as it is not available (anymore)
          updateOptions(
            self.map((o) => (o.id === option.id ? { ...o, quantity: 0 } : o)),
          );
        }

        return optionAvailable;
      })
      .map((option) => {
        if (unit.name === "Gandalf the White" && option.name === "Pippin") {
          return {
            ...option,
            selectable:
              option.quantity === 1 ||
              !!unit.options.find(
                (other) =>
                  other.name === "Shadowfax" &&
                  other.quantity > 0 &&
                  !getSetOfModelIds().find((model) =>
                    model.includes("peregrin-took"),
                  ),
              ),
          };
        }

        return option;
      });
  }

  return screen.isMobile ? (
    <Card
      sx={[
        { p: 0.5, position: "relative", zIndex: 0 },
        !valid
          ? {
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: invalidUnitSelectionBackgroundTint,
                zIndex: 1,
              },
            }
          : {},
      ]}
      elevation={2}
      data-test-id={`unit-card--w${warbandNum}-i${index}`}
      data-test-unit-name={`unit-card--${slugify(unit.name)}`}
    >
      <Stack
        sx={{
          p: 1.5,
          transition: "padding 0.5s",
          border: ({ palette: { success, grey } }) =>
            "3px " +
            (isLeader ? "solid " + success.light : "dashed " + grey.A400),
        }}
      >
        <Stack direction="row" gap={2}>
          <Stack>
            <UnitProfilePicture
              army={unit.profile_origin}
              profile={unit.name}
              size="smaller"
            />
            {!!toggleLeader && (
              <Collapse in={!collapsed}>
                <LeaderToggle
                  isLeader={isLeader}
                  handleToggle={toggleLeader}
                  isLeaderCompulsory={roster.metadata.leaderCompulsory}
                  testId={`hero-card--leader-toggle--warband-${warbandNum}`}
                  testName={`hero-card--leader-toggle--${slugify(unit.name)}`}
                />
              </Collapse>
            )}
          </Stack>

          <Stack direction="column" justifyContent="center" flexGrow={1}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={
                warnings === "on" && overExceededCollection
                  ? "warning.dark"
                  : "inherit"
              }
            >
              {unit.name}
            </Typography>
            <Typography
              data-test-id={`unit-card--points--w${warbandNum}-i${index}`}
              data-test-unit-name={`unit-card--points--${slugify(unit.name)}`}
            >
              Points: <b>{unit.pointsTotal}</b>
            </Typography>
            <Collapse in={!collapsed}>
              <Stack
                direction="column"
                gap={0.5}
                data-test-id={`unit-card--info--w${warbandNum}-i${index}`}
                data-test-unit-name={`unit-card--info--${slugify(unit.name)}`}
              >
                <Box>
                  <UnitTypeLabel unitType={unit.unit_type} />
                </Box>
                <MwfBadge unit={unit} />
              </Stack>
            </Collapse>
            <Collapse in={collapsed}>
              <Typography variant="body2">
                <i>{selectedOptions}</i>
              </Typography>
            </Collapse>
          </Stack>
        </Stack>

        <Collapse in={!collapsed}>
          {!!unit.options.length && (
            <Box sx={{ px: 2, py: 1 }}>
              <OptionList
                options={getOptionsForUnit()}
                variant="multiple"
                onSelect={updateOptions}
                warbandNum={warbandNum}
                index={index}
                unitName={unit.name}
              />
            </Box>
          )}
        </Collapse>
        <Stack direction="row" justifyContent="end" sx={{ mt: 2 }}>
          <CardActionButtons
            remove={unit.compulsory === true ? null : remove}
            reselect={unit.compulsory === true ? null : reselect}
            openProfileCard={openProfileCard}
            warbandNum={warbandNum}
            index={index}
            unitName={unit.name}
          />
        </Stack>
      </Stack>
    </Card>
  ) : (
    <Card
      sx={[
        { p: 0.5, position: "relative", zIndex: 0 },
        !valid
          ? {
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: invalidUnitSelectionBackgroundTint,
                zIndex: 1,
              },
            }
          : {},
      ]}
      elevation={2}
      data-test-id={`unit-card--w${warbandNum}-i${index}`}
      data-test-unit-name={`unit-card--${slugify(unit.name)}`}
    >
      <Stack
        direction="row"
        gap={2}
        sx={{
          p: collapsed ? 0.25 : 1.5,
          transition: "padding 0.5s",
          border: ({ palette: { success, grey } }) =>
            "3px " +
            (isLeader ? "solid " + success.light : "dashed " + grey.A400),
        }}
      >
        <Stack direction="column" gap={1}>
          <Collapse in={!collapsed}>
            <UnitProfilePicture
              army={unit.profile_origin}
              profile={unit.name}
            />
          </Collapse>
        </Stack>
        <Stack
          flexGrow={1}
          sx={{ px: 1 }}
          direction="row"
          justifyContent="center"
        >
          <Stack direction="column" flexGrow={1} justifyContent="center">
            <Stack direction="row" gap={2} alignItems="center">
              <Typography
                variant="h6"
                fontWeight="bold"
                color={
                  warnings === "on" && overExceededCollection
                    ? "warning.dark"
                    : "inherit"
                }
              >
                {unit.name}{" "}
                {collapsed && (
                  <span
                    style={{ fontWeight: "normal" }}
                    data-test-id={`quantity--w${warbandNum}-i${index}`}
                    data-test-name={`quantity--${slugify(unit.name)}`}
                  >
                    ({unit.pointsTotal ?? 1} pts.)
                  </span>
                )}
                <Collapse in={collapsed}>
                  <Typography variant="body2">
                    <i>{collapsed && selectedOptions}</i>
                  </Typography>
                </Collapse>
              </Typography>
              {!!toggleLeader && (
                <LeaderToggle
                  isLeader={isLeader}
                  handleToggle={toggleLeader}
                  isLeaderCompulsory={roster.metadata.leaderCompulsory}
                  testId={`hero-card--leader-toggle--warband-${warbandNum}`}
                  testName={`hero-card--leader-toggle--${slugify(unit.name)}`}
                />
              )}
            </Stack>
            <Collapse in={!collapsed}>
              <Stack
                direction="row"
                gap={1}
                alignItems="center"
                data-test-id={`unit-card--info--w${warbandNum}-i${index}`}
                data-test-unit-name={`unit-card--info--${slugify(unit.name)}`}
              >
                <UnitTypeLabel unitType={unit.unit_type} />
                <MwfBadge unit={unit} />
              </Stack>
              {!!unit.options.length && (
                <Box sx={{ pt: 1 }}>
                  <OptionList
                    options={getOptionsForUnit()}
                    variant="multiple"
                    onSelect={updateOptions}
                    warbandNum={warbandNum}
                    index={index}
                    unitName={unit.name}
                  />
                </Box>
              )}
            </Collapse>
          </Stack>
          <Stack
            alignItems="end"
            sx={{
              justifyContent: collapsed ? "center" : "space-between",
              transition: "justify-content 0.3s",
            }}
          >
            <Collapse in={!collapsed}>
              <Typography
                data-test-id={`unit-card--points--w${warbandNum}-i${index}`}
                data-test-unit-name={`unit-card--points--${slugify(unit.name)}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  gap: 0.5,
                }}
              >
                Points: <b>{unit.pointsTotal}</b>
              </Typography>
              {warnings === "on" && (
                <Typography
                  data-test-id={`unit-card--points--w${warbandNum}-i${index}`}
                  data-test-unit-name={`unit-card--points--${slugify(unit.name)}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                    gap: 0.5,
                  }}
                  color={overExceededCollection ? "error.dark" : "inherit"}
                >
                  <CategoryOutlined sx={{ fontSize: "1rem" }} />
                  Available: {available - selected}
                </Typography>
              )}
            </Collapse>
            <CardActionButtons
              remove={unit.compulsory === true ? null : remove}
              reselect={unit.compulsory === true ? null : reselect}
              openProfileCard={openProfileCard}
              warbandNum={warbandNum}
              index={index}
              unitName={unit.name}
            />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};
