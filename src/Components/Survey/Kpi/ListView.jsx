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
  { key: "name", label: "Name" },
  { key: "tag", label: "Tag" },
  { key: "category", label: "Category" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

export default function ListView() {
  const [kpis, setKpis] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    tag: "",
    description: "",
    categoryId: "",
    isActive: true,
  });

  // ========================
  // Fetch Categories
  // ========================
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/kpi-category-list");
      setCategories(res.data.data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  // ========================
  // Fetch KPIs
  // ========================
  const fetchKpis = async () => {
    try {
      const res = await axios.get("/survey-kpi-list");
      setKpis(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch KPIs");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchKpis();
  }, []);

  // ========================
  // Handle Change
  // ========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const generatedTag = value
        .toLowerCase()
        .trim()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      setForm((prev) => ({
        ...prev,
        name: value,
        tag: generatedTag,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSwitch = (e) => {
    setForm({ ...form, isActive: e.target.checked });
  };

  // ========================
  // Submit
  // ========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }

    const loadingToast = toast.loading("Saving KPI...");

    try {
      const payload = {
        name: form.name,
        tag: form.tag,
        description: form.description,
        categoryId: form.categoryId,
        isActive: form.isActive,
      };

      if (form.id) {
        await axios.put(`/survey-kpi/${form.id}`, payload);
        toast.success("KPI updated successfully");
      } else {
        await axios.post("/create-suvery-kpi", payload);
        toast.success("KPI created successfully");
      }

      setForm({
        id: null,
        name: "",
        tag: "",
        description: "",
        categoryId: "",
        isActive: true,
      });

      fetchKpis();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item._id,
      name: item.name,
      tag: item.tag,
      description: item.description || "",
      categoryId: item.categoryId?._id || "",
      isActive: item.isActive,
    });
  };

  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Deleting KPI...");

    try {
      await axios.delete(`/survey-kpi/${id}`);
      toast.success("KPI deleted successfully");
      fetchKpis();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Survey KPI Management
      </Typography>

      <Stack gap={3} flexDirection="row">
        <TextField
          label="KPI Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          size="small"
        />

        <TextField
          label="Tag"
          name="tag"
          value={form.tag}
          onChange={handleChange}
          size="small"
          fullWidth
        />

        {/* CATEGORY SELECT */}
        <FormControl fullWidth size="small">
          <InputLabel>Category</InputLabel>
          <Select
            name="categoryId"
            value={form.categoryId}
            label="Category"
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          size="small"
        />

        <FormControlLabel
          control={<Switch checked={form.isActive} onChange={handleSwitch} />}
          label="Active"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="small"
          onClick={handleSubmit}
        >
          {form.id ? "Update" : "Submit"}
        </Button>
      </Stack>

      <Box
        sx={{
          boxShadow:
            "0px 0px 2px rgba(145,158,171,0.2),0px 12px 24px -4px rgba(145,158,171,0.12)",
          borderRadius: "16px",
          p: 2,
          mt: 3,
        }}
      >
        <Box sx={{ overflowX: "auto", mb: 1 }}>
          <Table>
            <CustomeHeader
              columns={columns}
              includeActions={false}
              includeDrag={false}
            />

            {kpis.map((item, i) => (
              <TableRow hover key={i}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.tag}</TableCell>
                <TableCell>{item.categoryId?.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.isActive ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <Stack gap="12px" flexDirection="row">
                    <Button
                      size="small"
                      onClick={() => handleEdit(item)}
                      color="primary"
                      variant="outlined"
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      onClick={() => handleDelete(item._id)}
                      color="error"
                      variant="contained"
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
    </Box>
  );
}
