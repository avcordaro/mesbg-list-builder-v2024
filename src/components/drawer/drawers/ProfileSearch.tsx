import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Fragment, useState } from "react";
import { DatabaseRow, rows } from "../../../pages/database/data.ts";
import { useAppState } from "../../../state/app";
import { CustomAlert } from "../../common/alert/CustomAlert.tsx";
import { Stats } from "../../common/roster-pdf/sections/Stats.tsx";
import { ModalTypes } from "../../modal/modals.tsx";

const ProfileRow = ({
  profile: { profile, profile_origin, name, M, W, F },
}: {
  profile: DatabaseRow;
}) => {
  const [expanded, setExpanded] = useState(false);
  const { setCurrentModal } = useAppState();

  return (
    <Accordion expanded={expanded} onClick={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body1" component="div">
          <b>{name}</b>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stats
          profile={{
            name,
            ...profile,
            HM: !M || M === "-" ? undefined : M,
            HW: !W || W === "-" ? undefined : W,
            HF: !F || F === "-" ? undefined : F,
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentModal(ModalTypes.PROFILE_CARD, {
              unit: {
                name: name,
                profile_origin: profile_origin,
              },
              title: name,
            });
          }}
        >
          View full profile card
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export const ProfileSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState([]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filter = e.target.value.trim().toLowerCase();
    if (filter.length < 4) {
      setProfiles([]);
      return;
    }
    const newKeywordList = rows.filter((kw) =>
      kw.name.toLowerCase().includes(filter),
    );
    setProfiles(newKeywordList);
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

      {searchTerm.length < 4 && (
        <CustomAlert title="Enter a filter" severity="info">
          Start by entering the name of the profile you are looking for.
        </CustomAlert>
      )}

      {searchTerm.length >= 4 && profiles.length === 0 && (
        <CustomAlert title="No matches" severity="warning">
          No matches are found for your current filter criteria.
        </CustomAlert>
      )}

      {profiles.map((profile) => (
        <ProfileRow
          key={profile.name + profile.profile_origin}
          profile={profile}
        />
      ))}
    </Fragment>
  );
};
