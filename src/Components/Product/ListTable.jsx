import { Box, Table } from "@mui/material";
import CustomeHeader from "../Common/Table/CustomeHeader";
import Body from "./Table/Body";
import { useEffect, useState } from "react";
import axios from "../../api/axios";

import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../Common/RemoveConfirmation/ConfirmationModal";
import CustomePagination from "../Common/Table/CustomePagination";
import toast from "react-hot-toast";

export default function ListTable() {
  const navigate = useNavigate();

  const columns = [
    { key: "order", label: "Order" },
    { key: "name", label: "Name" },
    { key: "productCode", label: "Code" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price" },
    { key: "isPublished", label: "Status" },
  ];

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/products?page=${page}&limit=${rowsPerPage}`,
      );
      setProducts(res.data.products);
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage]);

  const handleOpenMenu = (event, row) => {
    setOpen(event.currentTarget);
    setSelectedRowId(row._id);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const redirectEdit = (id) => {
    navigate(`/product-setup/${id}`);
  };

  const redirectPreview = (id) => {
    navigate(`/product/${id}`);
  };

  const handleRemove = async () => {
    const toastId = toast.loading("Deleting product...");

    try {
      await axios.delete(`/products/${dataToDelete?._id}`);

      toast.success("Product deleted successfully", {
        id: toastId,
      });

      fetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to delete product", {
        id: toastId,
      });
      setIsModalOpen(false);
      console.error("Delete failed:", error);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination || source.index === destination.index) return;

    const reorderedProducts = Array.from(products);
    const [movedProduct] = reorderedProducts.splice(source.index, 1);
    reorderedProducts.splice(destination.index, 0, movedProduct);

    setProducts(reorderedProducts);

    const reorderedIds = reorderedProducts.map((p) => p._id);

    try {
      const response = await axios.post("/update-product-order", {
        reorderedProducts: reorderedIds,
      });

      if (response.data.success) {
        setProducts(response.data.products);
        toast.success("Product order updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update product order");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error: failed to update product order");
    }
  };
  return (
    <Box
      sx={{
        boxShadow:
          "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
        borderRadius: "16px",
        p: { xs: 0, sm: 2 },
        mt: 3,
      }}
    >
      <Table>
        <CustomeHeader
          columns={columns}
          includeActions={true}
          includeDrag={true}
        />

        <Body
          products={products}
          handleOpenMenu={handleOpenMenu}
          handleCloseMenu={handleCloseMenu}
          open={open}
          onDragEnd={onDragEnd}
          selectedRowId={selectedRowId}
          redirectEdit={redirectEdit}
          redirectPreview={redirectPreview}
          setIsModalOpen={setIsModalOpen}
          setDataToDelete={setDataToDelete}
        />
      </Table>

      <CustomePagination
        count={products.length}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />

      <ConfirmationModal
        open={isModalOpen}
        title="Delete Product"
        itemName={dataToDelete?.name || ""}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleRemove}
        loading={loading}
      />
    </Box>
  );
}
