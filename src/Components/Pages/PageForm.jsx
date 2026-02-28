import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function PageForm({ onSave }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // ⏳ Loading state
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    path: "",
    icon: "",
    isGroup: false,
    parentId: "",
    order: 0,
  });

  // Fetch groups for the dropdown
  useEffect(() => {
    axios.get("/resource-list").then((res) => {
      setGroups(res.data.filter((item) => item.isGroup));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const payload = {
      ...formData,
      parentId: formData.parentId === "" ? null : formData.parentId,
      slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
    };

    try {
      await axios.post("/create-resource", payload);

      toast.success("Page/Group Created Successfully!");

      if (onSave) onSave();
      navigate("/pages");
    } catch (err) {
      // 🚨 Extract specific error message from backend or use fallback
      const errorMsg = err.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
      console.error("Creation Error:", err);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Create New Resource
      </Typography>

      <TextField
        label="Title"
        fullWidth
        required
        disabled={loading}
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <TextField
        label="Path (e.g., /dashboard)"
        fullWidth
        disabled={formData.isGroup || loading}
        value={formData.path}
        onChange={(e) => setFormData({ ...formData, path: e.target.value })}
        helperText={formData.isGroup ? "Groups do not require a path" : ""}
      />

      <FormControlLabel
        control={
          <Checkbox
            disabled={loading}
            checked={formData.isGroup}
            onChange={(e) =>
              setFormData({
                ...formData,
                isGroup: e.target.checked,
                path: e.target.checked ? "" : formData.path,
                // If it's becoming a group, it can't have a parent (optional logic)
                parentId: e.target.checked ? "" : formData.parentId,
              })
            }
          />
        }
        label="Is this a Group? (Folder)"
      />

      <TextField
        select
        label="Parent Group"
        fullWidth
        disabled={loading}
        value={formData.parentId}
        onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
      >
        <MenuItem value="">None (Top Level)</MenuItem>
        {groups.map((g) => (
          <MenuItem key={g._id} value={g._id}>
            {g.title}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        type="number"
        label="Sequence Order"
        fullWidth
        disabled={loading}
        value={formData.order}
        onChange={(e) => setFormData({ ...formData, order: e.target.value })}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 1, height: "48px" }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Save Resource"
        )}
      </Button>
    </Box>
  );
}
