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
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import CustomeHeader from "../../Common/Table/CustomeHeader";

const columns = [
  { key: "title", label: "Title" },
  { key: "version", label: "Version" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

export default function ListView() {
  const [templates, setTemplates] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    questions: [],
    isActive: true,
  });

  // ========================
  // Fetch Questions (For Select)
  // ========================
  const fetchQuestions = async () => {
    try {
      const res = await axios.get("/survey-question-list");
      setQuestions(res.data.data);
    } catch (err) {
      toast.error("Failed to load questions");
    }
  };

  // ========================
  // Fetch Templates
  // ========================
  const fetchTemplates = async () => {
    try {
      const res = await axios.get("/survey-template-list");
      setTemplates(res.data.data);
    } catch (err) {
      toast.error("Failed to load templates");
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchTemplates();
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

  const handleQuestionsChange = (event) => {
    const {
      target: { value },
    } = event;
    setForm((prev) => ({
      ...prev,
      questions: typeof value === "string" ? value.split(",") : value,
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

    if (!form.title) {
      toast.error("Title is required");
      return;
    }

    const loadingToast = toast.loading("Saving Template...");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        questions: form.questions,
        isActive: form.isActive,
      };

      if (form.id) {
        await axios.put(`/survey-template/${form.id}`, payload);
        toast.success("Template updated (New Version Created)");
      } else {
        await axios.post("/create-suvery-template", payload);
        toast.success("Template created successfully");
      }

      setForm({
        id: null,
        title: "",
        description: "",
        questions: [],
        isActive: true,
      });

      fetchTemplates();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item._id,
      title: item.title,
      description: item.description || "",
      questions: item.questions.map((q) => q._id),
      isActive: item.isActive,
    });
  };

  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Deleting Template...");

    try {
      await axios.delete(`/survey-template/${id}`);
      toast.success("Template deactivated successfully");
      fetchTemplates();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleShare = async (id) => {
    const url = `https://www.mint.com.bd/survey/${id}`;

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Survey Template Setup
      </Typography>

      <Stack gap={3} flexDirection="row">
        {/* Title */}
        <TextField
          label="Template Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          required
          size="small"
        />

        {/* Description */}
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          size="small"
        />

        {/* Questions Multi Select */}
        <FormControl fullWidth size="small">
          <InputLabel>Questions</InputLabel>
          <Select
            multiple
            value={form.questions}
            onChange={handleQuestionsChange}
            input={<OutlinedInput label="Questions" />}
            renderValue={(selected) =>
              questions
                .filter((q) => selected.includes(q._id))
                .map((q) => q.questionText)
                .join(", ")
            }
          >
            {questions.map((q) => (
              <MenuItem key={q._id} value={q._id}>
                <Checkbox checked={form.questions.includes(q._id)} />
                <ListItemText primary={q.questionText} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
          {form.id ? "Update (New Version)" : "Submit"}
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

          {templates.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.version}</TableCell>
              <TableCell>{item.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={2}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="info"
                    onClick={() => handleShare(item._id)}
                  >
                    Share
                  </Button>
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
