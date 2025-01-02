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
import Typography from "@mui/material/Typography";
import { Fragment, FunctionComponent, useState } from "react";
import { useAppState } from "../../../state/app";
import { useUserPreferences } from "../../../state/preference";

const Keyword = ({
  name,
  active_passive,
  description,
  used,
  expanded: expandedProp,
}: {
  name: string;
  active_passive?: string;
  description: string;
  used: boolean;
  expanded?: boolean;
}) => {
  const { preferences } = useUserPreferences();
  const [expanded, setExpanded] = useState(expandedProp || false);

  return (
    <Accordion expanded={expanded} onClick={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
  keywords: { name: string; active_passive?: string; description: string }[];
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
