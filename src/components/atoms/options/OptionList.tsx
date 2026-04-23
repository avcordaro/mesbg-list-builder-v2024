import { FormGroup, FormHelperText } from "@mui/material";
import Box from "@mui/material/Box";
import { FunctionComponent } from "react";
import { Option } from "../../../types/mesbg-data.types.ts";
import { slugify } from "../../../utils/string.ts";
import { OptionItem } from "./OptionItem.tsx";

type OptionVariant = "multiple" | "single" | "single-mandatory";

export type OptionListProps = {
  options: (Option & { selectable?: boolean })[];
  variant: OptionVariant;
  onSelect: (option: Option[]) => void;

  unitName: string;
  warbandNum: number;
  index: number;
};

export const OptionList: FunctionComponent<OptionListProps> = ({
  options,
  variant,
  onSelect,
  unitName,
  warbandNum,
  index,
}) => {
  const multiple = variant === "multiple";
  const mandatory = variant === "single-mandatory";

  function updatedMultiSelection(
    { id, type, name }: Pick<Option, "id" | "name" | "type">,
    selected: boolean,
  ): Option[] {
    return options.map((o) => {
      // select the chosen option
      if (o.id === id) {
        return { ...o, quantity: selected ? 1 : 0 };
      }
      // deselect any option of the same type
      else if (!!o.type && o.type === type && selected) {
        return { ...o, quantity: o.included ? 1 : 0 };
      }
      // deselect Pippin if shadowfax is removed
      else if (name === "Shadowfax" && !selected && o.name === "Pippin") {
        return { ...o, quantity: 0 };
      } else if (
        unitName === "Treebeard" &&
        name === "Merry & Pippin" &&
        !selected &&
        o.name.startsWith("Elven Cloak")
      ) {
        return { ...o, quantity: 0 };
      }
      // return any other option unchanged
      else {
        return o;
      }
    });
  }

  function updatedSingularSelection(
    { id, type }: Pick<Option, "id" | "type">,
    selected: boolean,
  ): Option[] {
    return options.map((o) => {
      // toggle the chosen option
      if (o.id === id) {
        return { ...o, quantity: selected ? 1 : 0 };
      }

      // leave special warband upgrades untouched.
      else if (o.type === "special_warband_upgrade") {
        return o;
      }

      // deselect any other option
      else {
        // unless the toggled option was a special warband upgrade.
        if (type === "special_warband_upgrade") return o;
        // or the option was automatically included.
        if (o.included) return o;

        return { ...o, quantity: 0 };
      }
    });
  }

  function onSelectOption(option: Option, selected: boolean) {
    if (variant === "multiple")
      onSelect(updatedMultiSelection(option, selected));
    else onSelect(updatedSingularSelection(option, selected));
  }

  const wargearOptions = options.filter(
    (option) => option.type !== "special_warband_upgrade",
  );
  const specialUpgrades = options.filter(
    (option) => option.type === "special_warband_upgrade",
  );
  return (
    <FormGroup
      aria-labelledby="wargear-options"
      aria-required={mandatory}
      data-test-id={`option-list--w${warbandNum}-i${index}`}
      data-test-unit-name={`option-list--${slugify(unitName)}`}
    >
      {specialUpgrades.length > 0 && (
        <Box sx={{ mb: 1 }}>
          {specialUpgrades.map((option, optionIndex) => (
            <OptionItem
              key={option.id}
              option={option}
              selectable={option.selectable}
              onSelect={(selected) => onSelectOption(option, selected)}
              testId={`option-toggle--w${warbandNum}-i${index}--o${optionIndex}`}
              testName={`option-toggle--${slugify(unitName)}--${slugify(option.name)}`}
            />
          ))}
        </Box>
      )}
      {!multiple && wargearOptions.length > 0 && (
        <FormHelperText>
          You can only select a single wargear option
        </FormHelperText>
      )}
      {wargearOptions.map((option, optionIndex) => (
        <OptionItem
          key={option.id}
          option={option}
          selectable={option.selectable}
          onSelect={(selected) => onSelectOption(option, selected)}
          testId={`option-toggle--w${warbandNum}-i${index}--o${optionIndex}`}
          testName={`option-toggle--${slugify(unitName)}--${slugify(option.name)}`}
        />
      ))}
      {mandatory &&
        !options.find(
          (option) =>
            option.quantity === 1 && option.type !== "special_warband_upgrade",
        ) && (
          <FormHelperText
            sx={{
              marginBottom: ".8rem",
              color: ({ palette }) => palette.error.dark,
            }}
          >
            You must select one option for this model
          </FormHelperText>
        )}
    </FormGroup>
  );
};
