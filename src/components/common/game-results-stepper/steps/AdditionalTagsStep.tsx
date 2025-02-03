import { StepContent, StepLabel } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { AdditionalTagsInput } from "../../game-results-form/TagsInput.tsx";
import { StepProps } from "./StepProps.ts";

export const AdditionalTagsStep: FunctionComponent<StepProps> = ({
  formValues,
  updateFormValues,
}) => {
  return (
    <>
      <StepLabel
        optional={
          <Typography variant="caption" color="textDisabled">
            Optional
          </Typography>
        }
      >
        General - Additional Tags
      </StepLabel>
      <StepContent>
        <Typography>
          Adding extra tags to your match allows you to filter them in the match
          history page.
        </Typography>
        <Box sx={{ my: 2 }}>
          <AdditionalTagsInput
            values={formValues.tags}
            onChange={(values) => updateFormValues({ tags: values })}
          />
        </Box>
      </StepContent>
    </>
  );
};
