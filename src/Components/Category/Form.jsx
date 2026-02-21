import PropTypes from "prop-types";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";

export default function Form({
  handleSubmit,
  name,
  setName,
  isActive,
  setIsActive,
  editingId,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={600}>
          {editingId ? "Update Category" : "Create Category"}
        </Typography>

        <TextField
          label="Category Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          }
          label={isActive ? "Active" : "Inactive"}
        />

        <Button variant="contained" type="submit">
          {editingId ? "Update" : "Create"}
        </Button>
      </Stack>
    </form>
  );
}

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  setIsActive: PropTypes.func.isRequired,
  editingId: PropTypes.string,
};
