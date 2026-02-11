import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { statsIconMap } from "./icons";
import { useSharedStats } from "./useSiteStats";

const formatNumber = (value?: string | number) => {
  if (value === undefined || value === null) return "-";
  return new Intl.NumberFormat("en-GB").format(Number(value));
};

export const SiteStats = () => {
  const { stats, loading, error } = useSharedStats();

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom className="middle-earth">
        Community Stats
      </Typography>

      <Stack spacing={0.5}>
        <Typography variant="body1" color="text.secondary">
          A quick snapshot of what’s been happening on the builder.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          These numbers update hourly and reflect activity over the past 7 days.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Check back to see how things are trending.
        </Typography>
      </Stack>

      <Grid container spacing={2.5} sx={{ my: 6 }}>
        {[
          ["New users this week", "new_users_last_7_days"],
          ["Active users this week", "active_users_last_7_days"],
          ["Total users", "total_users"],
          ["Active games this week", "active_games_last_7_days"],
          ["Games this week", "games_last_7_days"],
          ["Total games", "total_games"],
          ["Rosters created this week", "rosters_created_last_7_days"],
          ["Total rosters", "total_rosters"],
        ].map(([label, key], index, items) => {
          const isLastRowWide = index >= items.length - 2; // last 2 tiles
          const Icon = statsIconMap[key as keyof typeof statsIconMap];

          return (
            <Grid
              size={{ xs: 12, md: 6, lg: isLastRowWide ? 6 : 4 }}
              key={label}
            >
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={4} alignItems="center">
                    <Box sx={{ pl: 2 }}>
                      <Icon size={70} />
                    </Box>
                    <Typography
                      variant="body2"
                      fontSize="1.4rem"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.4,
                        minHeight: "2.8em", // 2 lines × 1.4 line-height
                        display: "flex",
                        alignItems: "center",
                        textWrap: "pretty",
                      }}
                    >
                      {label}
                    </Typography>
                  </Stack>
                  <Typography variant="h4" sx={{ pt: 0.5, pb: 1, ml: 2 }}>
                    {loading ? (
                      <Skeleton width={120} />
                    ) : (
                      formatNumber(stats?.[key as keyof typeof stats])
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};
