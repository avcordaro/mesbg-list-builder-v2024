import { useTheme } from "@mui/material/styles";
import { Bar } from "react-chartjs-2";
import { PastGame } from "../../../../state/recent-games/history";

interface ArmiesPlayedProps {
  data: PastGame[];
}

export const ArmiesPlayedAgainstBarChart = ({ data }: ArmiesPlayedProps) => {
  const { palette } = useTheme();

  const barColors = [
    palette.success.light,
    palette.warning.light,
    palette.error.light,
  ];

  const armiesPlayed: Record<
    string,
    { won: number; lost: number; draw: number }
  > = data
    .filter((game) => !!game.opponentArmies)
    .flatMap((game) => ({
      armies: game.opponentArmies.split(",").map((a) => a.trim()),
      result: game.result.toLowerCase(),
    }))
    .reduce((acc, { armies, result }) => {
      armies.forEach((army) => {
        if (!acc[army]) {
          acc[army] = { won: 0, lost: 0, draw: 0 };
        }
        acc[army][result]++;
      });
      return acc;
    }, {});

  const victoryPointsData = {
    labels: Object.keys(armiesPlayed),
    datasets: ["won", "drawn", "lost"].map((key, index) => ({
      label: "Matches " + key,
      data: Object.values(armiesPlayed).map((wld) => wld[key]),
      yAxisID: "y1",
      backgroundColor: barColors[index],
    })),
  };

  return (
    <Bar
      data={victoryPointsData}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: "Armies Played Against (with WLD)",
          },
        },
        scales: {
          y1: {
            beginAtZero: true,
            stacked: true,
            ticks: {
              stepSize: 1,
            },
          },
          x: {
            stacked: true,
          },
        },
      }}
    />
  );
};
