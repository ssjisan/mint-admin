import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import { Remove } from "../../../assets/IconSet";

export default function Image({
  handleImageUpload,
  handleRemoveImage, // Added this prop
  images,
  thumbnailIndex,
  setThumbnailIndex,
}) {
  const cardStyle = {
    mb: 4,
    borderRadius: 3,
    boxShadow:
      "0 0 2px 0 rgba(145 158 171 / 20%), 0 12px 24px -4px rgba(145 158 171 / 12%)",
  };

  return (
    <Card sx={cardStyle}>
      <CardContent>
        <Typography variant="h6" fontWeight={600}>
          Images
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Product photo and thumbnail
        </Typography>

        <Button variant="outlined" component="label">
          Upload Images (Max 5)
          <input
            hidden
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>

        <Grid container spacing={2} mt={2}>
          {images.map((img, index) => {
            const imageSrc =
              img instanceof File ? URL.createObjectURL(img) : img.url;
            return (
              <Grid item key={index}>
                <Box sx={{ position: "relative" }}>
                  {/* Delete Button */}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      backgroundColor: "white",
                      boxShadow: 1,
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      zIndex: 2,
                    }}
                  >
                    <Remove size={24} color="red" />
                  </IconButton>

                  <div
                    style={{
                      border:
                        thumbnailIndex === index
                          ? "2px solid #1976d2"
                          : "1px solid #ccc",
                      padding: 6,
                      cursor: "pointer",
                      borderRadius: "8px",
                      overflow: "hidden",
                      width: 100,
                      height: 100,
                    }}
                    onClick={() => setThumbnailIndex(index)}
                  >
                    <img
                      src={imageSrc}
                      alt="preview"
                      width="100%"
                      height="100%"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}

Image.propTypes = {
  handleImageUpload: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired, // Update proptypes
  images: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
  thumbnailIndex: PropTypes.number,
  setThumbnailIndex: PropTypes.func.isRequired,
};
