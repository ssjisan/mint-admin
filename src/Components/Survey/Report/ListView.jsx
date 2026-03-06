"use client";

import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  Box,
  Button,
  Drawer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Stack,
  Typography,
} from "@mui/material";

export default function ListView() {
  const [data, setData] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [filters, setFilters] = useState({
    templateId: "",
    fromDate: "",
    toDate: "",
  });

  const [selectedResponse, setSelectedResponse] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ==============================
  // Get Current Month Default Dates
  // ==============================
  const getCurrentMonthRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      fromDate: firstDay.toISOString().split("T")[0],
      toDate: lastDay.toISOString().split("T")[0],
    };
  };

  // ==============================
  // Fetch Templates
  // ==============================
  const fetchTemplates = async () => {
    const res = await axios.get("/survey-template-list");
    setTemplates(res.data.data);
  };

  // ==============================
  // Fetch Responses
  // ==============================
  const fetchResponses = async () => {
    const res = await axios.get("/survey-responses-list", {
      params: filters,
    });
    setData(res.data.data);
  };

  // ==============================
  // Initial Load
  // ==============================
  useEffect(() => {
    const defaultRange = getCurrentMonthRange();

    setFilters((prev) => ({
      ...prev,
      fromDate: defaultRange.fromDate,
      toDate: defaultRange.toDate,
    }));

    fetchTemplates();
  }, []);

  // Fetch when filters change
  useEffect(() => {
    if (filters.fromDate && filters.toDate) {
      fetchResponses();
    }
  }, [filters]);

  // ==============================
  // Handle Filter Change
  // ==============================
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // Open Drawer
  // ==============================
  const handlePreview = (row) => {
    setSelectedResponse(row);
    setDrawerOpen(true);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Survey Responses
      </Typography>

      {/* ================= FILTERS ================= */}
      <Stack direction="row" spacing={2} mb={3}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Template</InputLabel>
          <Select
            name="templateId"
            value={filters.templateId}
            label="Template"
            onChange={handleFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            {templates.map((t) => (
              <MenuItem key={t._id} value={t._id}>
                {t.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          type="date"
          size="small"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleFilterChange}
        />

        <TextField
          type="date"
          size="small"
          name="toDate"
          value={filters.toDate}
          onChange={handleFilterChange}
        />

        <Button variant="contained" onClick={fetchResponses}>
          Filter
        </Button>
      </Stack>

      {/* ================= TABLE ================= */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Template</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Customer ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row.templateId?.title}</TableCell>
              <TableCell>{row.customerName}</TableCell>
              <TableCell>{row.customerId}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.score}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>
                {new Date(row.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handlePreview(row)}
                >
                  Preview
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ================= DRAWER ================= */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box width={400} p={3}>
          <Typography variant="h6" mb={2}>
            Survey Answers
          </Typography>

          {selectedResponse?.answers?.map((ans, index) => (
            <Box key={index} mb={2}>
              <Typography variant="body2">
                <strong>{ans.questionId?.questionText}</strong>
              </Typography>

              <Typography variant="body2">
                Answer: {String(ans.answer)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Drawer>
    </Box>
  );
}
