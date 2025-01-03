import { BookmarkAdd } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Collapse, Stack, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import {
  Fragment,
  FunctionComponent,
  PropsWithChildren,
  useState,
} from "react";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { mesbgData, profileData } from "../assets/data.ts";
import { SquareIconButton } from "../components/common/icon-button/SquareIconButton.tsx";
import { DrawerTypes } from "../components/drawer/drawers.tsx";
import { ModalTypes } from "../components/modal/modals.tsx";
import { useAppState } from "../state/app";
import { Unit } from "../types/mesbg-data.types.ts";
import { Profile } from "../types/profile-data.types.ts";

const ExtraInfoRow: FunctionComponent<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => {
  return (
    <Stack>
      <Typography>
        <b>{title}</b>
      </Typography>
      {children}
    </Stack>
  );
};

const DatabaseTableRow = ({
  row,
}: {
  row: {
    name: string;
    profile_origin: string;
    profile: Profile;
    army_list: string[];
    MWFW: unknown;
  };
}) => {
  const { palette } = useTheme();
  const { setCurrentModal, openSidebar } = useAppState();
  const [open, setOpen] = useState(false);

  const [might, will, fate] =
    row.name === "The Witch-king of Angmar" || row.name === "Ringwraith"
      ? ["*", "*", "*"]
      : row.MWFW[0]
        ? row.MWFW[0][1].split(":")
        : ["-", "-", "-"];

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset !important" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.profile_origin}</TableCell>
        <TableCell align="center">
          <SquareIconButton
            icon={<BsFillPersonVcardFill />}
            iconColor={palette.primary.contrastText}
            backgroundColor={palette.grey.A700}
            backgroundColorHover={palette.grey["900"]}
            onClick={() => {
              setCurrentModal(ModalTypes.PROFILE_CARD, {
                unit: {
                  name: row.name,
                  profile_origin: row.profile_origin,
                },
                title: row.name,
              });
            }}
          />
        </TableCell>
        <TableCell align="center">
          {row.profile.Mv !== "-" ? row.profile.Mv : row.profile.Range}
        </TableCell>
        <TableCell align="center">{row.profile.Fv}</TableCell>
        <TableCell align="center">{row.profile.Sv}</TableCell>
        <TableCell align="center">{row.profile.S}</TableCell>
        <TableCell align="center">{row.profile.D}</TableCell>
        <TableCell align="center">{row.profile.A}</TableCell>
        <TableCell align="center">{row.profile.W}</TableCell>
        <TableCell align="center">{row.profile.C}</TableCell>
        <TableCell align="center">{row.profile.I}</TableCell>
        <TableCell align="center">{might}</TableCell>
        <TableCell align="center">{will}</TableCell>
        <TableCell align="center">{fate}</TableCell>
        <TableCell align="center">
          <Tooltip title={`Add ${row.name} to your collection`}>
            <SquareIconButton
              icon={<BookmarkAdd />}
              iconColor={palette.primary.contrastText}
              backgroundColor={palette.grey.A700}
              backgroundColorHover={palette.grey["900"]}
              iconPadding="0.5rem"
              onClick={() => {}}
              disabled
            />
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={16}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Stack sx={{ p: 2 }} gap={1}>
              <ExtraInfoRow
                title={`${row.name} is available in the following army lists`}
              >
                <Typography>{row.army_list.join(", ")}</Typography>
              </ExtraInfoRow>
              <ExtraInfoRow title="Wargear">
                <Typography>{row.profile.wargear.join(", ")}</Typography>{" "}
              </ExtraInfoRow>
              {(row.profile.special_rules.length > 0 ||
                row.profile.active_or_passive_rules.length > 0) && (
                <ExtraInfoRow title="Special Rules">
                  <Typography>
                    {row.profile.special_rules.map((rule, index, self) => (
                      <Fragment key={rule}>
                        <Box
                          component="span"
                          sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            "&:hover": {
                              color: (theme) => theme.palette.primary.main,
                            },
                          }}
                          onClick={() => {
                            openSidebar(DrawerTypes.SPECIAL_RULE_SEARCH, {
                              searchKeyword: rule,
                            });
                          }}
                        >
                          {rule}
                        </Box>
                        {index < self.length - 1 ||
                          (row.profile.active_or_passive_rules.length > 0 &&
                            ",")}{" "}
                      </Fragment>
                    ))}
                    {row.profile.active_or_passive_rules.map(
                      (rule, index, self) => (
                        <Fragment key={rule.name}>
                          <Box
                            component="span"
                            sx={{
                              textDecoration: "underline",
                              cursor: "pointer",
                              "&:hover": {
                                color: (theme) => theme.palette.primary.main,
                              },
                            }}
                            onClick={() => {
                              setCurrentModal(ModalTypes.PROFILE_CARD, {
                                unit: {
                                  name: row.name,
                                  profile_origin: row.profile_origin,
                                },
                                title: row.name,
                              });
                            }}
                          >
                            {rule.name}
                          </Box>
                          {index < self.length - 1 && ","}{" "}
                        </Fragment>
                      ),
                    )}
                  </Typography>
                </ExtraInfoRow>
              )}
              {row.profile.magic_powers.length > 0 && (
                <ExtraInfoRow title="Magical Powers">
                  <Typography>
                    {row.profile.magic_powers.map((power, index, self) => (
                      <Fragment key={power.name}>
                        <Box
                          component="span"
                          sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            "&:hover": {
                              color: (theme) => theme.palette.primary.main,
                            },
                          }}
                          onClick={() => {
                            openSidebar(DrawerTypes.MAGICAL_POWER_SEARCH, {
                              searchKeyword: power.name,
                            });
                          }}
                        >
                          {power.name}
                        </Box>
                        {index < self.length - 1 && ","}{" "}
                      </Fragment>
                    ))}
                  </Typography>
                </ExtraInfoRow>
              )}
              {row.profile.heroic_actions.length > 0 && (
                <ExtraInfoRow title="Heroic Actions">
                  <Typography>
                    {row.profile.heroic_actions.map((action, index, self) => (
                      <Fragment key={action}>
                        <Box
                          component="span"
                          sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            "&:hover": {
                              color: (theme) => theme.palette.primary.main,
                            },
                          }}
                          onClick={() => {
                            openSidebar(DrawerTypes.HEROIC_ACTION_SEARCH, {
                              searchKeyword: action,
                            });
                          }}
                        >
                          {action}
                        </Box>
                        {index < self.length - 1 && ","}{" "}
                      </Fragment>
                    ))}
                  </Typography>
                </ExtraInfoRow>
              )}
            </Stack>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const Database = () => {
  const rows = Object.values(
    Object.values(mesbgData).reduce((acc, currentValue) => {
      const name = currentValue.name;
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(currentValue);

      return acc;
    }, {}),
  ).flatMap((dataPoint: Unit[]) => {
    return {
      name: dataPoint[0].name,
      army_type: dataPoint[0].army_type,
      profile_origin: dataPoint[0].profile_origin,
      unit_type: [...new Set(dataPoint.map((p) => p.unit_type))],
      army_list: dataPoint.map((p) => p.army_list),
      options: [
        ...new Set(dataPoint.flatMap((p) => p.options).map((o) => o.name)),
      ],
      MWFW: dataPoint.flatMap((p) => p.MWFW),
      profile: profileData[dataPoint[0].profile_origin][dataPoint[0].name],
    };
  });

  return (
    <Container maxWidth={false} sx={{ p: 2 }}>
      <Typography variant="h4" className="middle-earth" sx={{ mb: 2 }}>
        Profile database
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <Table sx={{ minWidth: 650 }} stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={4}>
                Profile
              </TableCell>
              <TableCell align="center" colSpan={13}>
                Stats
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell align="center">Card</TableCell>
              <TableCell align="center">Mv / Range</TableCell>
              <TableCell align="center">Fv</TableCell>
              <TableCell align="center">Sv</TableCell>
              <TableCell align="center">S</TableCell>
              <TableCell align="center">D</TableCell>
              <TableCell align="center">A</TableCell>
              <TableCell align="center">W</TableCell>
              <TableCell align="center">C</TableCell>
              <TableCell align="center">I</TableCell>
              <TableCell align="center">M</TableCell>
              <TableCell align="center">W</TableCell>
              <TableCell align="center">F</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((row) => (
                <DatabaseTableRow key={row.name} row={row} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
