import PropTypes from "prop-types";
import {
  TextField,
  Button,
  Stack,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { PlusIcon, Remove } from "../../../assets/IconSet";

export default function Form({
  packageName,
  setPackageName,
  price,
  setPrice,
  speedMbps,
  setSpeedMbps,
  type,
  setType,
  items,
  setItems,
  onSubmit,
  loading,
}) {
  /* ---------------- Item handlers ---------------- */

  const addItem = () => {
    setItems([...items, { id: Date.now(), title: "" }]);
  };

  const updateItem = (id, value) => {
    setItems(items.map((i) => (i.id === id ? { ...i, title: value } : i)));
  };

  const removeItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <Stack spacing={2}>
      {/* Package Name */}
      <TextField
        label="Package Name"
        value={packageName}
        onChange={(e) => setPackageName(e.target.value)}
        fullWidth
      />

      {/* Type */}
      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Select
          value={type}
          label="Type"
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="residential">Residential</MenuItem>
          <MenuItem value="corporate">Corporate</MenuItem>
        </Select>
      </FormControl>

      {/* Speed */}
      <TextField
        label="Speed"
        value={speedMbps}
        onChange={(e) => setSpeedMbps(e.target.value)}
        InputProps={{
          endAdornment: <InputAdornment position="end">Mbps</InputAdornment>,
        }}
      />

      {/* Price */}
      <TextField
        label="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start">৳</InputAdornment>,
        }}
      />

      {/* Items (Features) */}
      <Stack spacing={1}>
        {items.map((item) => (
          <Stack key={item.id} direction="row" spacing={1}>
            <TextField
              fullWidth
              label="Feature"
              value={item.title}
              onChange={(e) => updateItem(item.id, e.target.value)}
            />

            <IconButton color="error" onClick={() => removeItem(item.id)}>
              <Remove size={20} color={"red"} />
            </IconButton>
          </Stack>
        ))}

        <Button
          startIcon={<PlusIcon size={20} color="black" />}
          onClick={addItem}
          variant="outlined"
        >
          Add Feature
        </Button>
      </Stack>

      {/* Submit */}
      <Button variant="contained" onClick={onSubmit} disabled={loading}>
        Save Package
      </Button>
    </Stack>
  );
}

Form.propTypes = {
  packageName: PropTypes.string.isRequired,
  setPackageName: PropTypes.func.isRequired,
  price: PropTypes.string.isRequired,
  setPrice: PropTypes.func.isRequired,
  speedMbps: PropTypes.string.isRequired,
  setSpeedMbps: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  setType: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  setItems: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
