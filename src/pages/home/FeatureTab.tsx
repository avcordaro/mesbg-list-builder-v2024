import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Fragment } from "react";
import { useScreenSize } from "../../hooks/calculations-and-displays/useScreenSize";

type FeatureTabProps = {
  image: string;
  imageAlt: string;
  bullets: (string[] | string)[];
  index: number;
  value: number;
};

export const FeatureTab = (props: FeatureTabProps) => {
  const screen = useScreenSize();
  const { image, imageAlt, bullets, value, index, ...other } = props;

  const renderWithBold = (text: string) => {
    // Split on *...* but keep the markers
    const parts = text.split(/(\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return <strong key={i}>{part.slice(1, -1)}</strong>;
      }
      return <Fragment key={i}>{part}</Fragment>;
    });
  };

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`feature-${index}`}
      aria-labelledby={`feature-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          <Stack direction={!screen.isMobile ? "row" : "column"}>
            <Box sx={{ maxWidth: "42ch" }}>
              <img src={image} alt={imageAlt} />
            </Box>
            <Stack component="ul" gap={1}>
              {bullets.map((bullet, index) =>
                typeof bullet === "string" ? (
                  <Box key={index} component="li">
                    {renderWithBold(bullet)}
                  </Box>
                ) : (
                  <Stack key={index} component="ul" gap={1}>
                    {bullet.map((nested, nestedIndex) => (
                      <Box key={`${index}-${nestedIndex}`} component="li">
                        {renderWithBold(nested)}
                      </Box>
                    ))}
                  </Stack>
                ),
              )}
            </Stack>
          </Stack>
        </Box>
      )}
    </div>
  );
};
