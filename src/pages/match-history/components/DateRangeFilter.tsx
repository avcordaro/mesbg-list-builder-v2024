import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useState } from "react";

type DateRangeFilter = {
  start: string;
  end: string;
};

export const DateRangeFilter = ({
  availableDateRange,
  handleChangeFilter,
}: {
  availableDateRange: string;
  handleChangeFilter: (newValue: string) => void;
}) => {
  const [minAvailableDate, maxAvailableDate] = availableDateRange.split("/");
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>({
    start: "",
    end: "",
  });

  const handleChangeDateFilter = (
    name: keyof DateRangeFilter,
    value: string,
  ) => {
    const updatedDateRangeFilter = {
      ...dateRangeFilter,
      [name]: value,
    };

    setDateRangeFilter(updatedDateRangeFilter);

    handleChangeFilter(
      toDateFilterValue(
        updatedDateRangeFilter.start,
        updatedDateRangeFilter.end,
        minAvailableDate,
        maxAvailableDate,
      ),
    );
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <TextField
        label="From"
        type="date"
        size="small"
        sx={{ minWidth: "calc(100% / 2 - 4px)" }}
        value={dateRangeFilter.start}
        onChange={(event) =>
          handleChangeDateFilter("start", event.target.value)
        }
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          htmlInput: {
            min: minAvailableDate,
            max: dateRangeFilter.end || maxAvailableDate,
          },
        }}
      />

      <TextField
        label="Until"
        type="date"
        size="small"
        sx={{ minWidth: "calc(100% / 2 - 4px)" }}
        value={dateRangeFilter.end}
        onChange={(event) => handleChangeDateFilter("end", event.target.value)}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          htmlInput: {
            min: dateRangeFilter.start || minAvailableDate,
            max: maxAvailableDate,
          },
        }}
      />
    </Stack>
  );
};

const toDateFilterValue = (
  start: string,
  end: string,
  min: string,
  max: string,
): string => {
  if (!start && !end) {
    return "";
  }

  const startDate = start || min;
  const endDate = end || max;

  return startDate <= endDate
    ? `${startDate}/${endDate}`
    : `${endDate}/${startDate}`;
};
