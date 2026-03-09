"use client";

import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

export default function TemplateWisePerformance() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplatePerformance = async () => {
      try {
        const res = await axios.get("/dashboard-template-pereformance");

        if (res.data?.success) {
          setRows(res.data.data || []);
        } else {
          setRows([]);
        }
      } catch (error) {
        console.error("Error fetching template performance:", error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplatePerformance();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer
      sx={{
        borderRadius: "16px",
        boxShadow:
          "0px 0px 2px rgba(145,158,171,0.2), 0px 12px 24px -4px rgba(145,158,171,0.12)",
        padding: "16px",
      }}
    >
      <Typography variant="h6" sx={{ p: 2 }}>
        Template Wise Performance
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Template</TableCell>
            <TableCell>Total Submissions</TableCell>
            <TableCell>Average Score</TableCell>
            <TableCell>Excellent</TableCell>
            <TableCell>Good</TableCell>
            <TableCell>Average</TableCell>
            <TableCell>Poor</TableCell>
            <TableCell>Very Poor</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.templateName}</TableCell>
                <TableCell>{row.totalSubmissions}</TableCell>
                <TableCell>{row.averageScore?.toFixed(2)}</TableCell>
                <TableCell>{row.excellent}</TableCell>
                <TableCell>{row.good}</TableCell>
                <TableCell>{row.average}</TableCell>
                <TableCell>{row.poor}</TableCell>
                <TableCell>{row.veryPoor}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
