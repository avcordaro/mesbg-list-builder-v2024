import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { armyListData } from "../../../../assets/data.ts";
import { useRosterInformation } from "../../../../hooks/useRosterInformation.ts";
import { isMovieQuote } from "../../../../utils/string.ts";

export const ArmyBonuses = () => {
  const { roster, getAdjustedMetaData } = useRosterInformation();
  const { tttSpecialUpgrades } = getAdjustedMetaData();
  const armyListMetadata = armyListData[roster.armyList];

  return (
    <Stack>
      {armyListMetadata?.additional_rules?.length > 0 && (
        <>
          <Typography
            variant="h6"
            color="#800000"
            fontWeight="bold"
            textAlign="center"
          >
            Additional Rules
          </Typography>
          {armyListMetadata.additional_rules.map((rule, index) => (
            <Typography key={index}>
              &#9679;&nbsp;&nbsp;
              <Typography
                component="span"
                dangerouslySetInnerHTML={{ __html: rule.description }}
              />
            </Typography>
          ))}
        </>
      )}

      {armyListMetadata?.special_rules?.length > 0 && (
        <>
          <Typography
            variant="h6"
            color="#800000"
            fontWeight="bold"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            Special Rules
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", pl: 0, mb: 1 }}>
            {armyListMetadata.special_rules
              .filter((rule) => {
                if (!rule.troll_purchase) return true;
                return tttSpecialUpgrades.includes(rule.title);
              })
              .map((rule, index) => (
                <Box component="li" key={index} sx={{ py: 1 }}>
                  {isMovieQuote(rule.title) ? (
                    <Typography>
                      <b>
                        <i>{rule.title}</i>
                      </b>
                    </Typography>
                  ) : (
                    <Typography>
                      <b>
                        {rule.title}{" "}
                        {rule.title === "A Troll's Hoard" && (
                          <i>({tttSpecialUpgrades.length * 50} points)</i>
                        )}
                      </b>
                    </Typography>
                  )}
                  <Stack gap={1}>
                    {rule.description.split("\n").map((line, index) => (
                      <Typography
                        key={index}
                        dangerouslySetInnerHTML={{ __html: line }}
                      />
                    ))}
                  </Stack>
                </Box>
              ))}
          </Box>
        </>
      )}
      <Divider sx={{ mb: 2, height: 2, bgcolor: "#800000" }} />
    </Stack>
  );
};
