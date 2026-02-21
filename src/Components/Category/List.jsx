import PropTypes from "prop-types";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";

export default function List({
  categories,
  isLoading,
  onEditClick,
  onDeleteClick,
}) {
  if (isLoading) return <CircularProgress />;

  if (!categories?.length) return <p>No categories found</p>;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Slug</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {categories.map((cat) => (
          <TableRow key={cat._id}>
            <TableCell>{cat.name}</TableCell>
            <TableCell>{cat.slug}</TableCell>
            <TableCell>
              <Chip
                label={cat.isActive ? "Active" : "Inactive"}
                color={cat.isActive ? "success" : "default"}
                size="small"
              />
            </TableCell>
            <TableCell align="right">
              <Button size="small" onClick={() => onEditClick(cat._id)}>
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => onDeleteClick(cat)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

List.propTypes = {
  categories: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};
