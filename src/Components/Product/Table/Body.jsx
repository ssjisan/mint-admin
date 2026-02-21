import {
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Chip,
} from "@mui/material";
import { Edit, More, Remove, EyeBold } from "../../../assets/IconSet";
import PropTypes from "prop-types";
import CustomePopOver from "../../Common/PopOver/CustomePopOver";

export default function Body({
  products,
  handleOpenMenu,
  handleCloseMenu,
  open,
  selectedRowId,
  redirectEdit,
  redirectPreview,
  setIsModalOpen,
  setDataToDelete,
}) {
  return (
    <>
      <TableBody>
        {products.map((data) => (
          <TableRow key={data._id} hover>
            {/* Name */}
            <TableCell sx={{ minWidth: 200 }}>{data.name}</TableCell>

            {/* Product Code */}
            <TableCell sx={{ minWidth: 140 }}>{data.productCode}</TableCell>

            {/* Brand */}
            <TableCell sx={{ minWidth: 140 }}>
              {data.brand?.name || "-"}
            </TableCell>

            {/* Category */}
            <TableCell sx={{ minWidth: 140 }}>
              {data.category?.name || "-"}
            </TableCell>

            {/* Price */}
            <TableCell sx={{ minWidth: 120 }}>
              {data.showPrice ? `৳${data.price}` : "Hidden"}
            </TableCell>

            {/* Status */}
            <TableCell sx={{ minWidth: 120 }}>
              <Chip
                label={data.isPublished ? "Published" : "Draft"}
                color={data.isPublished ? "success" : "default"}
                size="small"
              />
            </TableCell>

            {/* Actions */}
            <TableCell align="center" sx={{ minWidth: 60 }}>
              <Tooltip title="Actions">
                <IconButton onClick={(e) => handleOpenMenu(e, data)}>
                  <More size={20} color="#919EAB" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <CustomePopOver
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        menuItems={[
          {
            label: "Preview",
            icon: EyeBold,
            onClick: () => {
              redirectPreview(selectedRowId);
              handleCloseMenu();
            },
          },
          {
            label: "Edit",
            icon: Edit,
            onClick: () => {
              redirectEdit(selectedRowId);
              handleCloseMenu();
            },
          },
          {
            label: "Delete",
            icon: Remove,
            color: "error",
            onClick: () => {
              const selectedProduct = products.find(
                (p) => p._id === selectedRowId,
              );
              setDataToDelete(selectedProduct); // store full object
              setIsModalOpen(true);
              handleCloseMenu();
            },
          },
        ]}
      />
    </>
  );
}

Body.propTypes = {
  products: PropTypes.array.isRequired,
  selectedRowId: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  redirectEdit: PropTypes.func.isRequired,
  redirectPreview: PropTypes.func.isRequired,
  handleCloseMenu: PropTypes.func.isRequired,
  handleOpenMenu: PropTypes.func.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  setDataToDelete: PropTypes.func.isRequired,
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
};
