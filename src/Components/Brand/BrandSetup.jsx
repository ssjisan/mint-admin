import { Grid, useMediaQuery } from "@mui/material";
import ConfirmationModal from "../Common/RemoveConfirmation/ConfirmationModal";
import { useEffect, useRef, useState } from "react";
import Form from "./Form";
import toast from "react-hot-toast";
import axios from "../../api/axios";
import List from "./List";

export default function BrandSetup() {
  const isSmDown = useMediaQuery("(max-width:767px)");
  const [brands, setBrands] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [dataToDelete, setDataToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPG, and WEBP formats are allowed.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a name.");
      return;
    }

    if (!editingId && !image) {
      toast.error("Please upload an image.");
      return;
    }

    if (image) {
      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedTypes.includes(image.type)) {
        toast.error("Only PNG, JPG, and WEBP formats are allowed.");
        return;
      }

      const oneMB = 1024 * 1024;
      if (image.size > oneMB) {
        toast.error("Image must be less than 1MB");
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);
    if (editingId) formData.append("id", editingId);

    const loadingToast = toast.loading(
      editingId ? "Updating..." : "Uploading...",
    );

    try {
      const { data } = await axios.post("/brand-handle", formData);

      toast.success(
        editingId ? "Brand updated successfully!" : "Brand added successfully!",
        { id: loadingToast },
      );

      setBrands((prev) =>
        editingId
          ? prev.map((c) => (c._id === editingId ? data.brand : c))
          : [data.brand, ...(prev || [])],
      );

      setName("");
      setImage(null);
      setPreview(null);
      setEditingId(null);
      fileInputRef.current.value = null;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong!", {
        id: loadingToast,
      });
    }
  };

  const handleRemove = async () => {
    if (!dataToDelete?._id) {
      toast.error("No client selected to delete.");
      return;
    }

    const loadingToast = toast.loading("Deleting...");

    try {
      await axios.delete(`/brand-delete/${dataToDelete._id}`);
      toast.success("Brand deleted successfully.", { id: loadingToast });

      setBrands((prev) =>
        prev?.filter((brand) => brand._id !== dataToDelete._id),
      );

      setSelectedRowId(null);
      setDataToDelete(null);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete brand.", { id: loadingToast });
    }
  };

  const handleEditClick = async (id) => {
    try {
      const res = await axios.get(`/brand/${id}`);
      const brand = res.data;

      if (!brand) {
        toast.error("Brand not found");
        return;
      }

      setName(brand.name);
      setPreview(brand.image?.url || null);
      setImage(null);
      setEditingId(id);
    } catch (error) {
      toast.error("Failed to load client for editing.");
    }
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get("/brands");
        setBrands(res.data || []);
      } catch {
        toast.error("Failed to load brands");
      }
    };
    fetchBrands();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        md={2}
        sx={{
          position: isSmDown ? "static" : "sticky",
          top: isSmDown ? "auto" : "80px",
          alignSelf: "flex-start",
          zIndex: 1,
        }}
      >
        <Form
          handleSubmit={handleSubmit}
          fileInputRef={fileInputRef}
          handleImageChange={handleImageChange}
          handleClickUpload={handleClickUpload}
          name={name}
          setName={setName}
          preview={preview}
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={10}
        sx={{
          pr: 1,
          mt: "36px",
        }}
      >
        <List
          brands={brands}
          selectedRowId={selectedRowId}
          dataToDelete={dataToDelete}
          setDataToDelete={setDataToDelete}
          onDeleteClick={(brand) => {
            setDataToDelete(brand);
            setIsModalOpen(true);
          }}
          onEditClick={handleEditClick}
        />

        <ConfirmationModal
          open={isModalOpen}
          title="Delete Brand"
          itemName={dataToDelete?.name || "Untitled"}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleRemove}
        />
      </Grid>
    </Grid>
  );
}
