import {
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface RadioMatrixProps {
  rows: string[];
  columns: (string | ReactNode)[];
  values: number[];
  selection: number[];
  setSelection: (selection: number[]) => void;
}

const RadioMatrix = ({
  rows,
  columns,
  values,
  selection,
  setSelection,
}: RadioMatrixProps) => {
  const handleChange = (rowIndex: number, colIndex: number) => {
    const newSelectedValues = selection.map((row, index) =>
      index === rowIndex ? values[colIndex] : row,
    );

    setSelection(newSelectedValues);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {columns.map((label, index) => (
              <TableCell key={index} align="center">
                <Typography sx={{ textWrap: "nowrap", minWidth: "8ch" }}>
                  {label}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((rowLabel, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>{rowLabel}</TableCell>
              {columns.map((_, colIndex) => (
                <TableCell key={colIndex} align="center">
                  <Radio
                    name={`row-${rowIndex}`}
                    checked={selection[rowIndex] === values[colIndex]}
                    onChange={() => handleChange(rowIndex, colIndex)}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RadioMatrix;
