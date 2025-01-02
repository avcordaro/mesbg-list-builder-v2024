import { Grid2 } from "@mui/material";
import Typography from "@mui/material/Typography";
import { armyListData } from "../../../../assets/data.ts";
import bowIcon from "../../../../assets/images/roster-summary/bow.png";
import brokenIcon from "../../../../assets/images/roster-summary/broken.png";
import defeatedIcon from "../../../../assets/images/roster-summary/defeated.png";
import throwIcon from "../../../../assets/images/roster-summary/throw-weapon.png";
import { useRosterInformation } from "../../../../hooks/useRosterInformation.ts";

interface HeaderBlockProps {
  includeRosterName: boolean;
}

export const HeaderBlock = ({ includeRosterName }: HeaderBlockProps) => {
  const { roster, getAdjustedMetaData } = useRosterInformation();
  const { break_point, bow_limit, throw_limit } = armyListData[roster.armyList];
  const {
    might,
    will,
    fate,
    units,
    points,
    bows,
    bowLimit,
    throwLimit,
    throwingWeapons,
  } = getAdjustedMetaData();

  const maxBows = Math.ceil(bowLimit * bow_limit);
  const maxThrows = Math.ceil(throwLimit * throw_limit);

  const iconHeight = "35px";
  return (
    <>
      {includeRosterName && (
        <>
          <Typography
            variant="body1"
            textAlign="center"
            fontWeight="bold"
            color="#800000"
            sx={{
              textDecoration: "underline",
              "text-decoration-thickness": "0.5px",
              mb: 1,
            }}
          >
            {roster.name}
          </Typography>
        </>
      )}
      <Typography
        variant="h5"
        textAlign="center"
        textTransform="uppercase"
        fontWeight="bold"
        color="#800000"
      >
        {roster.armyList}
      </Typography>
      <Typography
        variant="h6"
        textAlign="center"
        textTransform="uppercase"
        fontWeight="bold"
      >
        {points} points | {units} units
      </Typography>
      <Grid2
        container
        columnSpacing={1}
        rowSpacing={3}
        alignItems="center"
        sx={{ my: 2 }}
      >
        <Grid2 size={2.4} sx={{ textAlign: "center" }}>
          <img
            alt="total bows icon"
            src={bowIcon}
            style={{
              height: iconHeight,
            }}
          />
          <Typography fontWeight="bold">
            {bows} <sup style={{ fontWeight: "normal" }}>/ {maxBows}</sup>
          </Typography>
        </Grid2>
        <Grid2 size={2.4} sx={{ textAlign: "center" }}>
          <img
            alt="total throwing weapons icon"
            src={throwIcon}
            style={{
              height: iconHeight,
            }}
          />
          <Typography fontWeight="bold">
            {throwingWeapons}{" "}
            <sup style={{ fontWeight: "normal" }}>/ {maxThrows}</sup>
          </Typography>{" "}
        </Grid2>
        <Grid2 size={2.4} sx={{ textAlign: "center" }}>
          <img
            alt="break point icon"
            src={brokenIcon}
            style={{
              height: iconHeight,
            }}
          />
          <Typography fontWeight="bold">
            {Math.floor((break_point ?? 0.499) * units)} left
          </Typography>
        </Grid2>
        <Grid2 size={2.4} sx={{ textAlign: "center" }}>
          <img
            alt="quartered icon"
            src={defeatedIcon}
            style={{
              height: iconHeight,
            }}
          />
          <Typography fontWeight="bold">
            {Math.floor(0.25 * units)} left
          </Typography>
        </Grid2>
        <Grid2 size={2.4} sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              height: iconHeight,
              pt: "7px",
              mb: "5px",
            }}
            fontSize="1rem"
            variant="h6"
            color="#800000"
            fontWeight="bold"
          >
            M / W / F
          </Typography>
          <Typography fontWeight="bold">
            {might} / {will} / {fate}
          </Typography>
        </Grid2>
      </Grid2>
    </>
  );
};
