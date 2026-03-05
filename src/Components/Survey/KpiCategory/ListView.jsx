"use client";

import { useEffect, useState } from "react";
import axios from "../../../api/axios";
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
} from "@mui/material";
import CustomeHeader from "../../Common/Table/CustomeHeader";

const columns = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

export default function ListView() {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  // Fetch
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/kpi-category-list");
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If user types in name → auto update slug
    if (name === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: value
          .toLowerCase()
          .trim()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, ""),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Switch Change
  const handleSwitch = (e) => {
    setForm({ ...form, isActive: e.target.checked });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (form.id) {
        await axios.put(`/kpi-category/${form.id}`, form);
      } else {
        await axios.post("/create-kpi-category", form);
      }

      setForm({
        id: null,
        name: "",
        slug: "",
        description: "",
        isActive: true,
      });

      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item._id,
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      isActive: item.isActive,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/kpi-category/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        KPI Category Management
      </Typography>

      <Stack gap={3} flexDirection="row">
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          size="small"
        />

        <TextField
          label="Slug"
          name="slug"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value.toLowerCase(),
            })
          }
          size="small"
          fullWidth
        />

        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          size="small"
        />

        {/* Active Switch */}
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
            {categories.map((item, i) => {
              return (
                <TableRow hover key={i}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.slug}</TableCell>
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
              );
            })}
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
