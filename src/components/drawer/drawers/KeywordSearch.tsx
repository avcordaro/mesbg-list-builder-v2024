import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  InputAdornment,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Fragment, FunctionComponent, SyntheticEvent, useState } from "react";
import { useAppState } from "../../../state/app";
import { useUserPreferences } from "../../../state/preference";

const Keyword = ({
  name,
  active_passive,
  description,
  used,
  type,
  expanded: expandedProp,
}: {
  name: string;
  active_passive?: string;
  description: string;
  used: boolean;
  type: string;
  expanded?: boolean;
}) => {
  const { preferences } = useUserPreferences();
  const [expanded, setExpanded] = useState(expandedProp || false);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const chipConfig = {
    special_rule: {
      label: "Special rule",
      color: "secondary",
    },
    magical_power: {
      label: "Magical power",
      color: "info",
    },
    heroic_action: {
      label: "Heroic action",
      color: "warning",
    },
  }[type] as any;

  const handleChange = (_: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion expanded={expanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack
          justifyContent="space-between"
          direction="row"
          sx={{ width: "100%" }}
        >
          <Typography
            variant="body1"
            component="div"
            color={
              !preferences.colorCodedRules
                ? "inherit"
                : used
                  ? "success.light"
                  : "textSecondary"
            }
            sx={{
              textDecoration:
                preferences.colorCodedRules && used ? "underline" : "normal",
            }}
          >
            <b>{name}</b> {active_passive ? <i>({active_passive})</i> : ""}
          </Typography>
          {chipConfig && (
            <Chip
              size="small"
              label={chipConfig.label}
              color={chipConfig.color}
            />
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          <span
            dangerouslySetInnerHTML={{
              __html: description.replaceAll("\n", "<br />"),
            }}
          />
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export const KeywordSearch: FunctionComponent<{
  keywords: {
    name: string;
    active_passive?: string;
    description: string;
    type: string;
  }[];
  usedKeywords?: string[];
}> = ({ keywords, usedKeywords = [] }) => {
  const { openSidebarContext } = useAppState();
  const [searchTerm, setSearchTerm] = useState(
    openSidebarContext?.searchKeyword || "",
  );
  const [keywordList, setKeywordList] = useState(
    keywords.filter((kw) =>
      kw.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );
  const { preferences } = useUserPreferences();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const newKeywordList = keywords.filter((kw) =>
      kw.name.toLowerCase().includes(e.target.value.trim().toLowerCase()),
    );
    setKeywordList(newKeywordList);
  };

  return (
    <Fragment>
      <Box sx={{ mb: 1 }}>
        <TextField
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          fullWidth
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search..."
        />
      </Box>
      {preferences.splitActiveRules && usedKeywords.length > 0 && (
        <Box>
          <Typography sx={{ mb: 0.5 }} variant="h6">
            Relevant keywords for selected roster:
          </Typography>
          {keywordList
            .filter((rule) => usedKeywords.includes(rule.name))
            .map((kw) => {
              return (
                <Keyword
                  {...kw}
                  key={kw.name}
                  used={usedKeywords.includes(kw.name)}
                  expanded={keywordList.length === 1}
                />
              );
            })}
          <Typography sx={{ mt: 2.5, mb: 0.5 }} variant="h6">
            Other keywords:
          </Typography>
        </Box>
      )}

      {keywordList
        .filter(
          (rule) =>
            !preferences.splitActiveRules || !usedKeywords.includes(rule.name),
        )
        .map((kw) => {
          return (
            <Keyword
              {...kw}
              key={kw.name}
              used={usedKeywords.includes(kw.name)}
              expanded={keywordList.length === 1}
            />
          );
        })}
    </Fragment>
  );
};
