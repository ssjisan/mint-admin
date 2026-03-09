import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MyEditor from "../../Editor/Editor";
import PropTypes from "prop-types";

export default function Basic({
  brands,
  categories,
  formData,
  setFormData,
  descriptionEditorKey,
  descriptionEditorValue,
  setDescriptionEditorValue,
  setDescriptionHtmlOutput,
  descriptionEditorUploadedImages,
  setDescriptionEditorUploadedImages,
  shortDescriptionEditorKey,
  shortDescriptionEditorValue,
  setShortDescriptionEditorValue,
  setShortDescriptionHtmlOutput,
  shortDescriptionEditorUploadedImages,
  setShortDescriptionEditorUploadedImages,
  handleHighlightChange,
  highlights,
  removeHighlight,
  addHighlight,
}) {
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
          Details
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Title, short description
        </Typography>

        <Grid container spacing={3}>
          {/* Product Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>

          {/* Brand Dropdown */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            >
              {brands.map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Category Dropdown */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography fontSize={14} fontWeight={700} mb={1}>
              Product Highlights
            </Typography>

            <Stack spacing={2}>
              {highlights.map((highlight, index) => (
                <Stack key={index} direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`Highlight ${index + 1}`}
                    value={highlight}
                    onChange={(e) =>
                      handleHighlightChange(index, e.target.value)
                    }
                  />

                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => removeHighlight(index)}
                  >
                    Remove
                  </Button>
                </Stack>
              ))}

              <Button variant="outlined" onClick={addHighlight}>
                Add Highlight
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack>
              <Typography fontSize={14} fontWeight={700}>
                Short Description
              </Typography>
              <MyEditor
                key={`short-${shortDescriptionEditorKey}`}
                value={shortDescriptionEditorValue}
                onChangeValue={(json, html) => {
                  setShortDescriptionEditorValue(json);
                  setShortDescriptionHtmlOutput(html);
                }}
                uploadedImages={shortDescriptionEditorUploadedImages}
                setUploadedImages={setShortDescriptionEditorUploadedImages}
              />
            </Stack>
          </Grid>
          {/* Description (temporary plain text) */}
          <Grid item xs={12}>
            <Stack>
              <Typography fontSize={14} fontWeight={700}>
                Description
              </Typography>
              <MyEditor
                key={`long-${descriptionEditorKey}`}
                value={descriptionEditorValue}
                onChangeValue={(json, html) => {
                  setDescriptionEditorValue(json);
                  setDescriptionHtmlOutput(html);
                }}
                uploadedImages={descriptionEditorUploadedImages}
                setUploadedImages={setDescriptionEditorUploadedImages}
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
Basic.propTypes = {
  // =======================
  // Dropdown Data
  // =======================
  brands: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,

  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,

  // =======================
  // Form Data
  // =======================
  formData: PropTypes.shape({
    name: PropTypes.string,
    brand: PropTypes.string,
    category: PropTypes.string,
  }).isRequired,

  setFormData: PropTypes.func.isRequired,

  // =======================
  // Highlights
  // =======================
  highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleHighlightChange: PropTypes.func.isRequired,
  removeHighlight: PropTypes.func.isRequired,
  addHighlight: PropTypes.func.isRequired,

  // =======================
  // Short Description Editor
  // =======================
  shortDescriptionEditorKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,

  shortDescriptionEditorValue: PropTypes.any,
  setShortDescriptionEditorValue: PropTypes.func.isRequired,
  setShortDescriptionHtmlOutput: PropTypes.func.isRequired,

  shortDescriptionEditorUploadedImages: PropTypes.array,
  setShortDescriptionEditorUploadedImages: PropTypes.func.isRequired,

  // =======================
  // Description Editor
  // =======================
  descriptionEditorKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,

  descriptionEditorValue: PropTypes.any,
  setDescriptionEditorValue: PropTypes.func.isRequired,
  setDescriptionHtmlOutput: PropTypes.func.isRequired,

  descriptionEditorUploadedImages: PropTypes.array,
  setDescriptionEditorUploadedImages: PropTypes.func.isRequired,
};
