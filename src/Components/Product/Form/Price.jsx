import {
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

export default function Price({ formData, setFormData }) {
  const cardStyle = {
    mb: 4,
    borderRadius: 3,
    boxShadow:
      "0 0 2px 0 rgba(145 158 171 / 20%), 0 12px 24px -4px rgba(145 158 171 / 12%)",
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card sx={cardStyle}>
      <CardContent>
        <Typography variant="h6" fontWeight={600}>
          Price
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Price related inputs
        </Typography>

        <Grid container spacing={3}>
          {/* Price */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>

          {/* Show Price */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.showPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      showPrice: e.target.checked,
                    })
                  }
                />
              }
              label="Show Price"
            />
          </Grid>

          {/* Discount Type */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Discount Type"
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="percentage">Percentage</MenuItem>
              <MenuItem value="fixed">Fixed</MenuItem>
            </TextField>
          </Grid>

          {/* Discount Value (Only if not none) */}
          {formData.discountType !== "none" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Discount Value"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
Price.propTypes = {
  formData: PropTypes.shape({
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

    showPrice: PropTypes.bool.isRequired,

    discountType: PropTypes.oneOf(["none", "percentage", "fixed"]).isRequired,

    discountValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,

  setFormData: PropTypes.func.isRequired,
};
