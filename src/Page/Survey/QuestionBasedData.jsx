"use client";

import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
} from "@mui/material";

export default function QuestionBasedData() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/dashboard-question-insights");
        setRows(res.data.data || []);
      } catch (error) {
        console.error("Error fetching question data:", error);
      }
    };

    fetchData();
  }, []);

  const getPerformance = (percentage) => {
    if (percentage < 40) {
      return { label: `🔴 ${percentage}%`, color: "error" };
    }
    if (percentage < 70) {
      return { label: `🟡 ${percentage}%`, color: "warning" };
    }
    return { label: `🟢 ${percentage}%`, color: "success" };
  };

  return (
    <TableContainer
      sx={{
        borderRadius: "16px",
        boxShadow:
          "0px 0px 2px rgba(145,158,171,0.2), 0px 12px 24px -4px rgba(145,158,171,0.12)",
        padding: "16px",
      }}
    >
      <Box p={2}>
        <Typography variant="h6">Question Based Performance</Typography>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>KPI</TableCell>
            <TableCell>Question</TableCell>
            <TableCell>Weight</TableCell>
            <TableCell>Achieved</TableCell>
            <TableCell>Max</TableCell>
            <TableCell>Performance</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => {
            const performance = getPerformance(row.percentage);

            return (
              <TableRow key={index}>
                <TableCell>{row.kpiName}</TableCell>
                <TableCell>{row.question}</TableCell>
                <TableCell>{row.weight}</TableCell>
                <TableCell>{row.achievedMarks}</TableCell>
                <TableCell>{row.maxMarks}</TableCell>
                <TableCell>
                  <Chip
                    label={performance.label}
                    color={performance.color}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
