"use client";

import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import toast from "react-hot-toast";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Table,
  TableRow,
  TableCell,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CustomeHeader from "../../Common/Table/CustomeHeader";

const columns = [
  { key: "questionText", label: "Question" },
  { key: "kpi", label: "KPI" },
  { key: "type", label: "Type" },
  { key: "weight", label: "Weight" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

export default function ListView() {
  const [questions, setQuestions] = useState([]);
  const [kpis, setKpis] = useState([]);

  const [form, setForm] = useState({
    id: null,
    questionText: "",
    type: "",
    weight: 1,
    kpiId: "",
    isActive: true,
  });

  // ========================
  // Fetch KPI List
  // ========================
  const fetchKpis = async () => {
    try {
      const res = await axios.get("/survey-kpi-list");
      setKpis(res.data.data);
    } catch (err) {
      toast.error("Failed to load KPIs");
    }
  };

  // ========================
  // Fetch Questions
  // ========================
  const fetchQuestions = async () => {
    try {
      const res = await axios.get("/survey-question-list");
      setQuestions(res.data.data);
    } catch (err) {
      toast.error("Failed to load questions");
    }
  };

  useEffect(() => {
    fetchKpis();
    fetchQuestions();
  }, []);

  // ========================
  // Handle Change
  // ========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitch = (e) => {
    setForm({ ...form, isActive: e.target.checked });
  };

  // ========================
  // Submit
  // ========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.kpiId) {
      toast.error("Please select KPI");
      return;
    }

    if (!form.type) {
      toast.error("Please select question type");
      return;
    }

    const loadingToast = toast.loading("Saving Question...");

    try {
      const payload = {
        questionText: form.questionText,
        type: form.type,
        weight: Number(form.weight),
        kpiId: form.kpiId,
        isActive: form.isActive,
      };

      if (form.id) {
        await axios.put(`/survey-question/${form.id}`, payload);
        toast.success("Question updated successfully");
      } else {
        await axios.post("/create-suvery-question", payload);
        toast.success("Question created successfully");
      }

      setForm({
        id: null,
        questionText: "",
        type: "",
        weight: 1,
        kpiId: "",
        isActive: true,
      });

      fetchQuestions();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item._id,
      questionText: item.questionText,
      type: item.type,
      weight: item.weight,
      kpiId: item.kpiId?._id,
      isActive: item.isActive,
    });
  };

  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Deleting Question...");

    try {
      await axios.delete(`/survey-question/${id}`);
      toast.success("Question deleted successfully");
      fetchQuestions();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Survey Question Setup
      </Typography>

      <Stack gap={3} flexDirection="row">
        {/* Question Text */}
        <TextField
          label="Question"
          name="questionText"
          value={form.questionText}
          onChange={handleChange}
          fullWidth
          required
          size="small"
        />

        {/* KPI Select */}
        <FormControl fullWidth size="small">
          <InputLabel>KPI</InputLabel>
          <Select
            name="kpiId"
            value={form.kpiId}
            label="KPI"
            onChange={handleChange}
          >
            {kpis.map((kpi) => (
              <MenuItem key={kpi._id} value={kpi._id}>
                {kpi.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Type Select */}
        <FormControl fullWidth size="small">
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            value={form.type}
            label="Type"
            onChange={handleChange}
          >
            <MenuItem value="rating">Rating (5 Star)</MenuItem>
            <MenuItem value="yes_no">Yes / No</MenuItem>
            <MenuItem value="comment">Comment</MenuItem>
          </Select>
        </FormControl>

        {/* Weight */}
        <TextField
          label="Weight"
          name="weight"
          type="number"
          value={form.weight}
          onChange={handleChange}
          size="small"
        />

        {/* Active */}
        <FormControlLabel
          control={<Switch checked={form.isActive} onChange={handleSwitch} />}
          label="Active"
        />

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleSubmit}
        >
          {form.id ? "Update" : "Submit"}
        </Button>
      </Stack>

      {/* TABLE */}
      <Box sx={{ mt: 3 }}>
        <Table>
          <CustomeHeader
            columns={columns}
            includeActions={false}
            includeDrag={false}
          />

          {questions.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.questionText}</TableCell>
              <TableCell>{item.kpiId?.name}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.weight}</TableCell>
              <TableCell>{item.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={2}>
                  <Button
                    size="small"
                    onClick={() => handleEdit(item)}
                    variant="outlined"
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleDelete(item._id)}
                    variant="contained"
                    color="error"
                  >
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Box>
    </Box>
  );
}
