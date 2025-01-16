import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { heroConstraintData } from "../../../assets/data.ts";
import { useCalculator } from "../../../hooks/calculations-and-displays/useCalculator.ts";
import { useCollectionWarnings } from "../../../hooks/calculations-and-displays/useCollectionWarnings.ts";
import { useMwfMutations } from "../../../hooks/calculations-and-displays/useMwfMutations.ts";
import { useOptionDependencies } from "../../../hooks/calculations-and-displays/useOptionDependencies.ts";
import { useRosterInformation } from "../../../hooks/calculations-and-displays/useRosterInformation.ts";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { useUserPreferences } from "../../../state/preference";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { Option } from "../../../types/mesbg-data.types.ts";
import { SelectedUnit } from "../../../types/roster.ts";
import { slugify } from "../../../utils/string.ts";
import { LeaderToggle } from "../army-leader/LeaderToggle.tsx";
import { UnitProfilePicture } from "../images/UnitProfilePicture.tsx";
import { MwfBadge } from "../might-will-fate/MwfBadge.tsx";
import { OptionList } from "../option/OptionList.tsx";
import { UnitTypeLabel } from "../unit-type/UnitTypeLabel.tsx";
import { CardActionButtons } from "./CardActionButtons.tsx";
import { QuantityButtons } from "./QuantityButtons.tsx";
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
  const { mode } = useThemeContext();
  const calculator = useCalculator();
  const { checkDependency } = useOptionDependencies(warbandId);
  const { roster, getSetOfModelIds, isCustomRoster } = useRosterInformation();
  const screen = useScreenSize();
  const mwf = useMwfMutations();
  const { warnings, available, selected, overExceededCollection } =
    useCollectionWarnings(unit);
  const { preferences } = useUserPreferences();

  const valid =
    isCustomRoster ||
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

  function updateQuantity(value: number) {
    console.debug("Update warrior quantity.", { value });
    updateUnit(
      calculator.recalculatePointsForUnit({
        ...unit,
        quantity: value,
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
      .map((option, _, otherOptions) => {
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

        if (
          unit.name === "Treebeard" &&
          option.name.startsWith("Elven Cloak")
        ) {
          return {
            ...option,
            selectable:
              option.quantity === 1 ||
              !!unit.options.find(
                (other) =>
                  other.name === "Merry & Pippin" && other.quantity > 0,
              ),
          };
        }

        if (unit.name === "Dragon") {
          if (option.quantity > 0) return option;

          const optionCap =
            unit.model_id === "[dragons-of-the-north] dragon-general" ? 3 : 2;

          const selectedOptions = otherOptions
            .map(({ quantity }) => quantity ?? 0)
            .reduce((a, b) => a + b, 0);

          const isCapped = selectedOptions < optionCap;

          return isCapped
            ? { ...option, selectable: true }
            : { ...option, selectable: false };
        }

        return option;
      });
  }

  return screen.isMobile ? (
    <Card
      sx={[
        {
          p: 0.5,
          position: "relative",
          zIndex: 0,
          backgroundColor: ({ palette }) =>
            mode === "dark" ? palette.grey["800"] : "",
        },
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
              {!unit.unique && followerOf
                ? `${unit.quantity}x ${unit.name}`
                : unit.name}
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
                {warnings === "on" && (
                  <Typography
                    color={
                      overExceededCollection
                        ? mode === "dark"
                          ? "error.light"
                          : "error.dark"
                        : "inherit"
                    }
                  >
                    {available === 0
                      ? "Not in collection"
                      : `Left in collection: ${available - selected}`}
                  </Typography>
                )}
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
        <Collapse in={!(collapsed && !preferences.forceShowCardActionButtons)}>
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
            {!unit.unique && followerOf && (
              <QuantityButtons
                quantity={unit.quantity}
                updateQuantity={updateQuantity}
                warbandNum={warbandNum}
                index={index}
                unitName={unit.name}
                collapsed={collapsed}
              />
            )}
            <CardActionButtons
              remove={
                unit.compulsory === true &&
                !preferences.allowCompulsoryGeneralDelete
                  ? null
                  : remove
              }
              reselect={
                unit.compulsory === true &&
                !preferences.allowCompulsoryGeneralDelete
                  ? null
                  : reselect
              }
              openProfileCard={openProfileCard}
              warbandNum={warbandNum}
              index={index}
              unitName={unit.name}
            />
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  ) : (
    <Card
      sx={[
        {
          p: 0.5,
          position: "relative",
          zIndex: 0,
          backgroundColor: ({ palette }) =>
            mode === "dark" ? palette.grey["800"] : "",
        },
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
          <Stack
            direction="column"
            gap={1}
            sx={{
              p: 0.5,
              width: 105,
            }}
          >
            <Collapse in={!collapsed} unmountOnExit={true}>
              <UnitProfilePicture
                army={unit.profile_origin}
                profile={unit.name}
              />
            </Collapse>
            {!unit.unique && followerOf && (
              <QuantityButtons
                quantity={unit.quantity}
                updateQuantity={updateQuantity}
                warbandNum={warbandNum}
                index={index}
                unitName={unit.name}
                collapsed={collapsed}
              />
            )}
          </Stack>
        </Stack>
        <Stack
          flexGrow={1}
          sx={{ px: 1 }}
          direction="row"
          justifyContent="center"
        >
          <Stack direction="column" flexGrow={1} justifyContent="start">
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
                {!unit.unique && followerOf
                  ? `${unit.quantity}x ${unit.name}`
                  : unit.name}{" "}
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
                  color={
                    overExceededCollection
                      ? mode === "dark"
                        ? "error.light"
                        : "error.dark"
                      : "inherit"
                  }
                >
                  {available === 0
                    ? "Not in collection"
                    : `Left in collection: ${available - selected}`}
                </Typography>
              )}
            </Collapse>
            <CardActionButtons
              remove={
                unit.compulsory === true &&
                !preferences.allowCompulsoryGeneralDelete
                  ? null
                  : remove
              }
              reselect={
                unit.compulsory === true &&
                !preferences.allowCompulsoryGeneralDelete
                  ? null
                  : reselect
              }
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
