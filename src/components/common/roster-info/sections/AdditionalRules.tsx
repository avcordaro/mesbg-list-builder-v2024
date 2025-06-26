import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { armyListData } from "../../../../assets/data.ts";
import { RosterInformationProps } from "../RosterInformation.tsx";
import { RosterInformationSection } from "../RosterInformationSection.tsx";

export const AdditionalRules: FunctionComponent<
  Pick<RosterInformationProps, "roster"> & { size?: "dense" | "normal" }
> = ({ roster, size = "normal" }) => {
  const armyListMetadata = armyListData[roster.armyList];

  if (!armyListMetadata || armyListMetadata.additional_rules.length === 0)
    return <></>;

  return (
    <RosterInformationSection title="Additional rules">
      <Box component="ul" sx={{ pl: 3, pb: 2 }}>
        {armyListMetadata?.additional_rules?.map((rule, index) => (
          <Typography
            component="li"
            key={index}
            sx={{ py: size === "normal" ? 1 : 0 }}
          >
            <Typography
              component="span"
              dangerouslySetInnerHTML={{ __html: rule.description }}
            />
          </Typography>
        ))}
      </Box>
    </RosterInformationSection>
  );
};
