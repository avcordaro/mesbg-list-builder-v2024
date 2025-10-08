import Typography from "@mui/material/Typography";
import { SpecialRule } from "./types.ts";

type AdditionalRuleProps = {
  index: number;
  rule: SpecialRule;
};

export function AdditionalRule({ index, rule }: AdditionalRuleProps) {
  return (
    <Typography
      key={index}
      sx={{
        textAlign: "justify",
        mb: 1,
        lineHeight: 1.2,
        "& span": {
          lineHeight: 1.2,
        },
      }}
    >
      <Typography component="span" fontWeight="bold">
        {rule.name}
      </Typography>{" "}
      -{" "}
      <Typography
        component="span"
        fontWeight="bold"
        color={getTypeColor(rule.type)}
      >
        {rule.type}
      </Typography>{" "}
      - <Typography component="span">{rule.description}</Typography>
    </Typography>
  );
}

function getTypeColor(type: string) {
  switch (type) {
    case "Active":
      return "#C00000";
    case "Passive":
      return "#806000";
    case "Brutal Power Attack":
      return "#0070C0";

    default:
      return "green";
  }
}
