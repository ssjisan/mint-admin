import {
  Box,
  Collapse,
  IconButton,
  Stack,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { ArrowDown, ArrowUp, Bullet, More } from "../../../assets/IconSet";
import PropTypes from "prop-types";
import CustomePopOver from "../../Common/PopOver/CustomePopOver";
import NoData from "../../../assets/NoData";
import React, { useState } from "react";

export default function Body({
  preOrders,
  handleCloseMenu,
  handleOpenMenu,
  open,
  selectedRowId,
  handleOpenStatusModal,
}) {
  const [openRowId, setOpenRowId] = useState(null);

  const handleToggleRow = (id) => {
    setOpenRowId((prev) => (prev === id ? null : id));
  };

  const getStatusColors = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { color: "#FF9800", background: "rgba(255,152,0,0.1)" };
      case "confirmed":
        return { color: "#4CAF50", background: "rgba(76,175,80,0.1)" };
      case "cancelled":
        return { color: "#F44336", background: "rgba(244,67,54,0.1)" };
      case "completed":
        return { color: "#1976d2", background: "rgba(25,118,210,0.1)" };
      default:
        return { color: "#000", background: "rgba(0,0,0,0.1)" };
    }
  };

  if (!preOrders.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={9}>
            <Stack alignItems="center" mt={4}>
              <NoData />
              <Typography>No data here!</Typography>
            </Stack>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <>
      <TableBody>
        {preOrders.map((data) => {
          const { color, background } = getStatusColors(data.status);
          const isOpen = openRowId === data._id;

          return (
            <React.Fragment key={data._id}>
              <TableRow hover>
                <TableCell>
                  <IconButton onClick={() => handleToggleRow(data._id)}>
                    {isOpen ? (
                      <ArrowUp size={"20px"} color="black" />
                    ) : (
                      <ArrowDown size={"20px"} color="black" />
                    )}
                  </IconButton>
                </TableCell>

                <TableCell>{data.customer?.name}</TableCell>

                <TableCell>{data.product?.name}</TableCell>
                <TableCell>{data.product?.brand?.name || "N/A"}</TableCell>
                <TableCell>{data.product?.category?.name || "N/A"}</TableCell>

                <TableCell>{data.quantity}</TableCell>
                <TableCell>৳ {data.finalPrice}</TableCell>

                <TableCell>
                  <Box
                    sx={{ color, background, px: 1, py: 0.5, borderRadius: 1 }}
                  >
                    {data.status}
                  </Box>
                </TableCell>

                <TableCell>
                  <IconButton onClick={(e) => handleOpenMenu(e, data._id)}>
                    <More size={"20px"} color="black" />
                  </IconButton>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={10}>
                  <Collapse in={isOpen}>
                    <Box sx={{ p: 2, background: "#f9f9f9" }}>
                      {data.customer?.email && (
                        <Typography>
                          <strong>Email:</strong> {data.customer.email}
                        </Typography>
                      )}
                      {data.customer?.phone && (
                        <Typography>
                          <strong>Phone:</strong> {data.customer?.phone}
                        </Typography>
                      )}

                      {data.customer?.address && (
                        <Typography>
                          <strong>Address:</strong> {data.customer.address}
                        </Typography>
                      )}

                      {data.notes && (
                        <Typography>
                          <strong>Notes:</strong> {data.notes}
                        </Typography>
                      )}

                      <Typography>
                        <strong>Created:</strong>{" "}
                        {new Date(data.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          );
        })}
      </TableBody>

      <CustomePopOver
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        menuItems={[
          {
            label: "Pending",
            onClick: () => handleOpenStatusModal(selectedRowId, "pending"),
          },
          {
            label: "Confirmed",
            onClick: () => handleOpenStatusModal(selectedRowId, "confirmed"),
          },
          {
            label: "Completed",
            onClick: () => handleOpenStatusModal(selectedRowId, "completed"),
          },
          {
            label: "Cancelled",
            onClick: () => handleOpenStatusModal(selectedRowId, "cancelled"),
          },
        ]}
      />
    </>
  );
}
