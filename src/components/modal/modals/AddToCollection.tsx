import {
  AlertTitle,
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  FormGroup,
  Grid2,
  Stack,
  TextField,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useScreenSize } from "../../../hooks/useScreenSize.ts";
import { useAppState } from "../../../state/app";
import { useCollectionState } from "../../../state/collection";
import { Option } from "../../../types/mesbg-data.types.ts";
import { CustomAlert } from "../../common/alert/CustomAlert.tsx";
import { CustomSwitch } from "../../common/switch/CustomSwitch.tsx";

export const AddToCollection = () => {
  const {
    closeModal,
    modalContext: { unit },
  } = useAppState();
  const { inventory, upsertInventory } = useCollectionState();
  const { isMobile } = useScreenSize();

  const isHero = unit.unit_type.every((v: string) => v.includes("Hero"));
  const loadoutOptions = [
    "Generic",
    ...unit.options
      .filter(
        (option: Option) =>
          !isHero || !option.type || !option.type.includes("mount"),
      )
      .filter((option: Option) => option.type !== "ringwraith_amwf")
      .filter((option: Option) => option.type !== "special_warband_upgrade")
      .map((option: Option) => option.name),
    !unit.option_mandatory ? "None" : null,
  ].filter((v) => !!v);

  const wbUpgrade: Option | undefined = unit.options.find(
    (o) => o.type === "special_warband_upgrade",
  );

  console.log({ loadoutOptions, wbUpgrade });

  const mountOptions = unit.options
    .filter((option: Option) => !!option.type && option.type.includes("mount"))
    .map((option: Option) =>
      option.name
        .replaceAll("with armour", "")
        .replaceAll("Armoured", "")
        .trim(),
    )
    .filter((name: string) => !name.includes("Upgrade to"))
    .filter(
      (o: string, i: number, s: string[]) =>
        s.findIndex((ot) => ot === o) === i,
    );

  const [showErrors, setShowErrors] = useState(false);
  const [loadOuts, setLoadOuts] = useState<
    {
      options: string | string[];
      mount: string;
      amount: string;
    }[]
  >(
    !!inventory[unit.profile_origin] &&
      !!inventory[unit.profile_origin][unit.name]
      ? inventory[unit.profile_origin][unit.name].collection
      : [
          {
            options: isHero ? ["Generic"] : "Generic",
            mount: "",
            amount: "",
          },
        ],
  );

  const handleInputChange = (
    index: number,
    field: string,
    value: string | string[],
  ) => {
    const updatedRows = loadOuts.map((row, i) =>
      i === index ? { ...row, [field]: value } : row,
    );
    setLoadOuts(updatedRows);
  };

  const addRow = () => {
    setLoadOuts([
      ...loadOuts,
      { options: isHero ? ["Generic"] : "Generic", mount: "", amount: "" },
    ]);
  };

  const removeRow = (index: number) => {
    setLoadOuts(loadOuts.filter((_, i) => i !== index));
  };

  const errors = loadOuts.map(({ amount, options }, index) => {
    const amountToLow = Number(amount) <= 0;
    const missingLoadout = options.length === 0;
    const hasGenericCombiLoadout =
      typeof options !== "string" &&
      options.length > 1 &&
      options.includes("Generic");
    const hasNoneCombiLoadout =
      typeof options !== "string" &&
      options.length > 1 &&
      options.includes("None");

    const errors = [
      amountToLow ? "Amount must be at least 1 or higher" : "",
      missingLoadout ? "A loadout must be selected" : "",
      hasGenericCombiLoadout
        ? "Loadout type 'Generic' cannot be combined with other items"
        : "",
      hasNoneCombiLoadout
        ? "Loadout type 'None' cannot be combined with other items"
        : "",
    ].filter((s) => !!s);

    return {
      invalid:
        amountToLow ||
        missingLoadout ||
        hasGenericCombiLoadout ||
        hasNoneCombiLoadout,
      errorMessages: errors,
      index,
    };
  });

  const handleSave = () => {
    setShowErrors(true);

    if (errors.some((error) => error.invalid)) {
      return;
    }

    upsertInventory(unit.profile_origin, unit.name, {
      collection: loadOuts,
    });
    closeModal();
  };

  return (
    <>
      <DialogContent>
        <CustomAlert severity="info" title="">
          <AlertTitle>
            Add <strong>{unit.name}</strong> to you collection of miniatures.
          </AlertTitle>
          <Typography>
            Adding different loadouts based on the available options will help
            you to ensure your rosters only include models that you own,
            providing a seamless way to plan and optimise your army lists.
          </Typography>
        </CustomAlert>

        {loadoutOptions.length > 2 && (
          <CustomAlert severity="info" title="Generic profiles">
            <Typography>
              Select the &apos;Generic&apos; option to indicate that the model
              can be counted as any model under the same name, regardless of
              options (with the exception of being mounted/on-foot).
            </Typography>
          </CustomAlert>
        )}

        {showErrors && errors.some((error) => error.invalid) && (
          <Alert severity="error" icon={false} sx={{ my: 1 }}>
            <Typography>
              There are some errors on row(s){" "}
              {errors
                .filter((error) => error.invalid)
                .map((l) => l.index + 1)
                .join(", ")
                .replace(/,(?=[^,]*$)/, " &")}
              .
            </Typography>
            <Box component="ul">
              {errors
                .filter((error) => error.invalid)
                .flatMap((error) => error.errorMessages)
                .filter((m, i, s) => s.indexOf(m) === i)
                .map((message, index) => (
                  <Typography component="li" key={index}>
                    {message}
                  </Typography>
                ))}
            </Box>
          </Alert>
        )}

        <Stack sx={{ my: 2 }} gap={isMobile ? 4 : 1}>
          {loadOuts.map((loadOut, index) => (
            <FormGroup key={index}>
              <Grid2 container spacing={1}>
                {isHero && mountOptions.length > 0 && (
                  <Grid2
                    size={isMobile ? 12 : 3}
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    {mountOptions.length > 1 ? (
                      <Autocomplete
                        options={mountOptions}
                        value={loadOut.mount}
                        fullWidth
                        onChange={(_, value: string | string[]) =>
                          handleInputChange(index, "mount", value)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Mount"
                            placeholder="Select a mount, or leave empty"
                            helperText=""
                          />
                        )}
                      />
                    ) : (
                      <FormControlLabel
                        control={
                          <CustomSwitch
                            checked={loadOut.mount.length > 0}
                            onChange={(_, checked) =>
                              checked
                                ? handleInputChange(
                                    index,
                                    "mount",
                                    mountOptions[0],
                                  )
                                : handleInputChange(index, "mount", "")
                            }
                            name="Mounted"
                            color="primary"
                          />
                        }
                        label="Mounted"
                      />
                    )}
                  </Grid2>
                )}
                {loadoutOptions.length > 2 && (
                  <Grid2
                    size={
                      isMobile
                        ? 12
                        : !isHero || mountOptions.length === 0
                          ? 9
                          : 6
                    }
                  >
                    <Autocomplete
                      multiple={isHero}
                      options={loadoutOptions}
                      value={loadOut.options}
                      disableClearable={!isHero}
                      disabled={loadoutOptions.length <= 2}
                      onChange={(_, value: string | string[]) =>
                        handleInputChange(index, "options", value)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Loadout"
                          error={showErrors && loadOut.options.length <= 0}
                          placeholder={
                            isHero
                              ? "Select 1 or more options"
                              : "Select an option"
                          }
                        />
                      )}
                    />
                  </Grid2>
                )}
                <Grid2
                  size={
                    isMobile
                      ? 9
                      : loadoutOptions.length <= 2
                        ? isHero && mountOptions.length > 0
                          ? 8
                          : 10
                        : 2
                  }
                >
                  <TextField
                    value={loadOut.amount}
                    onChange={(event) =>
                      handleInputChange(index, "amount", event.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    label="Amount"
                    error={showErrors && Number(loadOut.amount) <= 0}
                    slotProps={{
                      input: { type: "number" },
                    }}
                  />
                </Grid2>
                <Grid2
                  size={isMobile ? 3 : 1}
                  sx={{
                    justifyContent: "end",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <Button
                    color="error"
                    onClick={() => removeRow(index)}
                    disabled={index === 0 && loadOuts.length <= 1}
                  >
                    Remove
                  </Button>
                </Grid2>
              </Grid2>
            </FormGroup>
          ))}

          {((isHero && mountOptions.length > 0) ||
            loadoutOptions.length >= 3) && (
            <Button onClick={() => addRow()}>Add row</Button>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          onClick={closeModal}
          data-test-id="dialog--cancel-button"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          color="primary"
          data-test-id="dialog--submit-button"
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
};
