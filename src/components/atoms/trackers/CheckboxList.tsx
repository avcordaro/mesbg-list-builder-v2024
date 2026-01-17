import Stack from "@mui/material/Stack";

export const CheckboxList = ({
  amount,
  mode,
  border = 1,
}: {
  amount: string;
  mode: "dark" | "light";
  border?: number;
}) => {
  return (
    <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="center">
      {Array.from({ length: Number(amount) }).map((_, index) => (
        <div
          key={index}
          className="stat-tracker-box"
          style={{
            width: "20px",
            height: "20px",
            border:
              mode === "dark"
                ? `${border}px solid white`
                : `${border}px solid black`,
            borderRadius: "20px",
          }}
        ></div>
      ))}
    </Stack>
  );
};
