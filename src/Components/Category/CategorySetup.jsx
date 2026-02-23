import { Grid, useMediaQuery } from "@mui/material";
import ConfirmationModal from "../Common/RemoveConfirmation/ConfirmationModal";
import { useEffect, useState } from "react";
import Form from "./Form";
import toast from "react-hot-toast";
import axios from "../../api/axios";
import List from "./List";

export default function CategorySetup() {
  const isSmDown = useMediaQuery("(max-width:767px)");

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [dataToDelete, setDataToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch All
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/categories");
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter category name");
      return;
    }

    const loadingToast = toast.loading(
      editingId ? "Updating..." : "Creating...",
    );

    try {
      if (editingId) {
        const { data } = await axios.put(`/category/${editingId}`, {
          name,
          isActive,
        });

        setCategories((prev) =>
          prev.map((c) => (c._id === editingId ? data : c)),
        );

        toast.success("Category updated!", { id: loadingToast });
      } else {
        const { data } = await axios.post("/create-category", {
          name,
          isActive,
        });

        setCategories((prev) => [data, ...prev]);

        toast.success("Category created!", { id: loadingToast });
      }

      setName("");
      setIsActive(true);
      setEditingId(null);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong", {
        id: loadingToast,
      });
    }
  };

  // 🔹 Edit
  const handleEditClick = async (id) => {
    try {
      const { data } = await axios.get(`/category/${id}`);
      setName(data.name);
      setIsActive(data.isActive);
      setEditingId(id);
    } catch {
      toast.error("Failed to load category");
    }
  };

  // 🔹 Delete
  const handleRemove = async () => {
    try {
      await axios.delete(`/category-delete/${dataToDelete._id}`);

      setCategories((prev) => prev.filter((c) => c._id !== dataToDelete._id));

      toast.success("Category deleted");
      setIsModalOpen(false);
      setDataToDelete(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        md={3}
        sx={{
          position: isSmDown ? "static" : "sticky",
          top: isSmDown ? "auto" : "80px",
          alignSelf: "flex-start",
        }}
      >
        <Form
          handleSubmit={handleSubmit}
          name={name}
          setName={setName}
          isActive={isActive}
          setIsActive={setIsActive}
          editingId={editingId}
        />
      </Grid>

      <Grid item xs={12} md={9}>
        <List
          categories={categories}
          isLoading={loading}
          onEditClick={handleEditClick}
          onDeleteClick={(item) => {
            setDataToDelete(item);
            setIsModalOpen(true);
          }}
        />

        <ConfirmationModal
          open={isModalOpen}
          title="Delete Category"
          itemName={dataToDelete?.name}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleRemove}
        />
      </Grid>
    </Grid>
  );
}
