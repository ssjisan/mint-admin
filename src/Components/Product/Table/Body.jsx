import {
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Chip,
} from "@mui/material";
import { Edit, More, Remove, EyeBold, Drag } from "../../../assets/IconSet";
import PropTypes from "prop-types";
import CustomePopOver from "../../Common/PopOver/CustomePopOver";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

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
  onDragEnd,
}) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="products">
        {(provided) => (
          <TableBody ref={provided.innerRef} {...provided.droppableProps}>
            {products.map((data, index) => (
              <Draggable key={data._id} draggableId={data._id} index={index}>
                {(provided) => (
                  <TableRow
                    hover
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    {/* Drag Handle */}
                    <TableCell align="center" {...provided.dragHandleProps}>
                      <Tooltip title="Drag">
                        <IconButton sx={{ width: "40px", height: "40px" }}>
                          <Drag color="#919EAB" size={24} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    <TableCell sx={{ minWidth: 64 }}>{data?.order}</TableCell>

                    <TableCell sx={{ minWidth: 200 }}>{data.name}</TableCell>

                    <TableCell sx={{ minWidth: 140 }}>
                      {data.productCode}
                    </TableCell>

                    <TableCell sx={{ minWidth: 140 }}>
                      {data.brand?.name || "-"}
                    </TableCell>

                    <TableCell sx={{ minWidth: 140 }}>
                      {data.category?.name || "-"}
                    </TableCell>

                    <TableCell sx={{ minWidth: 120 }}>
                      {data.showPrice ? `৳${data.price}` : "Hidden"}
                    </TableCell>

                    <TableCell sx={{ minWidth: 120 }}>
                      <Chip
                        label={data.isPublished ? "Published" : "Draft"}
                        color={data.isPublished ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center" sx={{ minWidth: 60 }}>
                      <Tooltip title="Actions">
                        <IconButton onClick={(e) => handleOpenMenu(e, data)}>
                          <More size={20} color="#919EAB" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )}
              </Draggable>
            ))}

            {/* Important: Placeholder must stay inside TableBody */}
            {provided.placeholder}
          </TableBody>
        )}
      </Droppable>

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
              setDataToDelete(selectedProduct);
              setIsModalOpen(true);
              handleCloseMenu();
            },
          },
        ]}
      />
    </DragDropContext>
  );
}
Body.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      order: PropTypes.number,
      name: PropTypes.string.isRequired,
      productCode: PropTypes.string,
      brand: PropTypes.shape({
        name: PropTypes.string,
      }),
      category: PropTypes.shape({
        name: PropTypes.string,
      }),
      price: PropTypes.number,
      showPrice: PropTypes.bool,
      isPublished: PropTypes.bool,
    }),
  ).isRequired,
  selectedRowId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  redirectEdit: PropTypes.func.isRequired,
  redirectPreview: PropTypes.func.isRequired,
  handleCloseMenu: PropTypes.func.isRequired,
  handleOpenMenu: PropTypes.func.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  setDataToDelete: PropTypes.func.isRequired,
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  onDragEnd: PropTypes.func.isRequired,
};
