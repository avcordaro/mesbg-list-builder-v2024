import { BookmarkAdd, Edit } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Collapse, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Fragment, useState } from "react";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { SquareIconButton } from "../../../components/common/icon-button/SquareIconButton.tsx";
import { DrawerTypes } from "../../../components/drawer/drawers.tsx";
import { ModalTypes } from "../../../components/modal/modals.tsx";
import { useScreenSize } from "../../../hooks/useScreenSize.ts";
import { useAppState } from "../../../state/app";
import { useCollectionState } from "../../../state/collection";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { COMPOSED_UNIT_MAP } from "../utils/special-rows.ts";
import { DatabaseRowData } from "./DatabaseTable.tsx";
import { ExtraInfoRow } from "./ExtraInformationSection.tsx";

export const DatabaseTableRow = ({ row }: { row: DatabaseRowData }) => {
  const { palette } = useTheme();
  const { inventory } = useCollectionState();
  const { mode } = useThemeContext();

  const screen = useScreenSize();
  const { setCurrentModal, openSidebar } = useAppState();
  const [open, setOpen] = useState(false);

  const existsInInv =
    !!inventory[row.profile_origin] &&
    !!inventory[row.profile_origin][
      COMPOSED_UNIT_MAP[row.name] || row.name.replaceAll(" (General)", "")
    ];

  const [might, will, fate] = [row.M, row.W, row.F];

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
            backgroundColor={
              mode === "dark" ? palette.grey.A400 : palette.grey.A700
            }
            backgroundColorHover={
              mode === "dark" ? palette.grey.A700 : palette.grey["900"]
            }
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
        {screen.isDesktop && (
          <>
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
          </>
        )}
        <TableCell align="center">
          <SquareIconButton
            icon={existsInInv ? <Edit /> : <BookmarkAdd />}
            iconColor={palette.primary.contrastText}
            backgroundColor={
              existsInInv
                ? palette.primary.dark
                : mode === "dark"
                  ? palette.grey.A400
                  : palette.grey.A700
            }
            backgroundColorHover={
              mode === "dark" ? palette.grey.A700 : palette.grey["900"]
            }
            iconPadding="0.5rem"
            onClick={() => {
              setCurrentModal(ModalTypes.ADD_TO_COLLECTION, {
                unit: {
                  name:
                    COMPOSED_UNIT_MAP[row.name] ||
                    row.name.replaceAll(" (General)", ""),
                  profile_origin: row.profile_origin,
                  options: row.options,
                  option_mandatory: row.option_mandatory,
                  unit_type: row.unit_type,
                },
                title: existsInInv
                  ? `Edit collection`
                  : `Add to your collection`,
              });
            }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={16}>
          <Collapse in={open} timeout="auto">
            <Stack sx={{ p: 2 }} gap={1}>
              {!screen.isDesktop && (
                <ExtraInfoRow title="Stats">
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
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
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell align="center">
                            {row.profile.Mv !== "-"
                              ? row.profile.Mv
                              : row.profile.Range}
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
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ExtraInfoRow>
              )}
              <ExtraInfoRow title="Available Army Lists">
                <Typography>{row.army_list.join(", ")}</Typography>
              </ExtraInfoRow>
              {row.profile.wargear.length > 0 && (
                <ExtraInfoRow title="Wargear">
                  <Typography>{row.profile.wargear.join(", ")}</Typography>{" "}
                </ExtraInfoRow>
              )}

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
                              searchKeyword: rule.replace(/\(.*?\)/g, ""),
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
              {row.options.length > 0 && (
                <ExtraInfoRow title="Possible options">
                  <Typography>
                    &quot;{row.options.map((o) => o.name).join('", "')}&quot;
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
