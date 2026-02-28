import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Box,
  Button,
  Stack,
  Table,
  Drawer,
  Typography,
  Divider,
  MenuItem,
  TextField,
} from "@mui/material";
import CustomeHeader from "../../Components/Common/Table/CustomeHeader";
import CustomePagination from "../../Components/Common/Table/CustomePagination";
import toast from "react-hot-toast";
import ConfirmationModal from "../../Components/Common/RemoveConfirmation/ConfirmationModal";
import Body from "./View/Body";
import dayjs from "dayjs";
import { Filter } from "../../assets/IconSet";

export default function View() {
  /* ------------------ TABLE COLUMNS ------------------ */

  const columns = [
    { key: "customer", label: "Customer" },
    { key: "product", label: "Product" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Qty" },
    { key: "finalPrice", label: "Total" },
    { key: "status", label: "Status" },
  ];

  /* ------------------ STATE ------------------ */

  const [preOrders, setPreOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [open, setOpen] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const [isStatusModal, setIsStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  /* ------------------ FILTER STATE ------------------ */

  const [openFilter, setOpenFilter] = useState(false);

  const [filterValues, setFilterValues] = useState({
    status: "",
    brand: "",
    category: "",
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  });

  /* ------------------ LOAD PREORDERS ------------------ */

  const loadPreOrders = async (filters = {}) => {
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== ""),
      );
      const params = new URLSearchParams(cleanFilters).toString();
      const res = await axios.get(`/pre-orders?${params}`);

      setPreOrders(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load pre-orders");
    }
  };

  useEffect(() => {
    loadPreOrders({});
  }, []);

  /* ------------------ STATUS UPDATE ------------------ */

  const handleStatusConfirm = async () => {
    if (!selectedRowId) return;

    const toastId = toast.loading("Updating status...");

    try {
      await axios.patch(`/pre-orders/${selectedRowId}/status`, {
        status: selectedStatus,
      });

      toast.success("Status updated successfully");
      setIsStatusModal(false);
      setPage(0);
      loadPreOrders(filterValues);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      toast.dismiss(toastId);
    }
  };

  /* ------------------ FILTER APPLY ------------------ */

  const handleApplyFilter = () => {
    setPage(0); // reset page when filtering
    loadPreOrders(filterValues);
    setOpenFilter(false);
  };

  /* ------------------ PAGINATION ------------------ */

  const paginatedData = preOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  /* ------------------ UI ------------------ */

  return (
    <Box
      sx={{
        boxShadow:
          "0px 0px 2px rgba(145,158,171,0.2),0px 12px 24px -4px rgba(145,158,171,0.12)",
        borderRadius: "16px",
        p: 2,
        mt: 3,
      }}
    >
      {/* FILTER BUTTON */}
      <Stack flexDirection="row" justifyContent="flex-end" py={2}>
        <Button
          onClick={() => setOpenFilter(true)}
          startIcon={<Filter size={20} color="#792DF8" />}
        >
          Filter
        </Button>
      </Stack>

      {/* TABLE */}
      <Box sx={{ overflowX: "auto", mb: 1 }}>
        <Table>
          <CustomeHeader
            columns={columns}
            includeActions={true}
            includeDrag={true}
          />

          <Body
            preOrders={paginatedData}
            handleOpenMenu={(e, id) => {
              setOpen(e.currentTarget);
              setSelectedRowId(id);
            }}
            handleCloseMenu={() => setOpen(null)}
            open={open}
            selectedRowId={selectedRowId}
            handleOpenStatusModal={(id, status) => {
              setSelectedRowId(id);
              setSelectedStatus(status);
              setIsStatusModal(true);
            }}
          />
        </Table>
      </Box>

      {/* PAGINATION */}
      <CustomePagination
        count={preOrders.length}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />

      {/* STATUS CONFIRM */}
      <ConfirmationModal
        open={isStatusModal}
        onClose={() => setIsStatusModal(false)}
        onConfirm={handleStatusConfirm}
        confirmColor="primary"
        confirmLabel="Save"
        title={`Change Status to "${selectedStatus}"`}
        message="Confirm status change."
      />

      {/* FILTER DRAWER */}
      <Drawer
        anchor="right"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
      >
        <Box sx={{ width: 320, p: 3 }}>
          <Typography variant="h6" mb={2}>
            Filter PreOrders
          </Typography>

          {/* STATUS */}
          <TextField
            select
            fullWidth
            size="small"
            label="Status"
            sx={{ mb: 2 }}
            value={filterValues.status}
            onChange={(e) =>
              setFilterValues({ ...filterValues, status: e.target.value })
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>

          {/* DATE */}
          <Divider sx={{ my: 2 }} />

          <TextField
            type="date"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={filterValues.startDate}
            onChange={(e) =>
              setFilterValues({ ...filterValues, startDate: e.target.value })
            }
          />

          <TextField
            type="date"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={filterValues.endDate}
            onChange={(e) =>
              setFilterValues({ ...filterValues, endDate: e.target.value })
            }
          />

          <Stack direction="row" spacing={2} mt={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setFilterValues({
                  status: "",
                  brand: "",
                  category: "",
                  startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
                  endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
                });
              }}
            >
              Reset
            </Button>

            <Button variant="contained" fullWidth onClick={handleApplyFilter}>
              Apply
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}
