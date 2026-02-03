import {
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Chip,
  Stack,
} from "@mui/material";
import CustomePopOver from "../../../Common/PopOver/CustomePopOver";
import { Edit, More, Remove } from "../../../../assets/IconSet";
import PropTypes from "prop-types";

export default function Body({
  packages,
  handleCloseMenu,
  handleOpenMenu,
  open,
  selectedRowId,
  setDataToDelete,
  setIsModalOpen,
  redirectEdit,
}) {
  const formatDateTime = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);

    return date.toLocaleString();
  };

  return (
    <>
      <TableBody>
        {packages.map((data) => (
          <TableRow key={data._id}>
            {/* Name */}
            <TableCell sx={{ minWidth: 220 }}>{data.packageName}</TableCell>

            {/* Type Tag */}
            <TableCell sx={{ minWidth: 140 }}>
              <Chip
                label={data.type}
                color={data.type === "corporate" ? "secondary" : "primary"}
                size="small"
              />
            </TableCell>

            {/* Speed */}
            <TableCell sx={{ minWidth: 140 }}>{data.speedMbps} Mbps</TableCell>

            {/* Price */}
            <TableCell sx={{ minWidth: 120 }}>৳{data.price}</TableCell>

            {/* Features */}
            {/* <TableCell sx={{ minWidth: 220 }}>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {data.items?.slice(0, 3).map((item) => (
                  <Chip key={item.id} label={item.title} size="small" />
                ))}
                {data.items?.length > 3 && (
                  <Chip label={`+${data.items.length - 3}`} size="small" />
                )}
              </Stack>
            </TableCell> */}

            {/* Created */}
            <TableCell sx={{ minWidth: 180 }}>
              {formatDateTime(data.createdAt)}
            </TableCell>

            {/* Actions */}
            <TableCell align="center" sx={{ minWidth: 64 }}>
              <Tooltip title="Actions">
                <IconButton onClick={(e) => handleOpenMenu(e, data)}>
                  <More color="#919EAB" size={24} />
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
              setDataToDelete(selectedRowId);
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
  packages: PropTypes.array.isRequired,
  selectedRowId: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  redirectEdit: PropTypes.func.isRequired,
  handleCloseMenu: PropTypes.func.isRequired,
  handleOpenMenu: PropTypes.func.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  setDataToDelete: PropTypes.func.isRequired,
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
};
