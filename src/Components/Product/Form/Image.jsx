import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";

export default function Image({
  handleImageUpload,
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
          {images.map((img, index) => (
            <Grid item key={index}>
              <div
                style={{
                  border:
                    thumbnailIndex === index
                      ? "2px solid #1976d2"
                      : "1px solid #ccc",
                  padding: 6,
                  cursor: "pointer",
                }}
                onClick={() => setThumbnailIndex(index)}
              >
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  width={100}
                  height={100}
                  style={{ objectFit: "cover" }}
                />
              </div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
Image.propTypes = {
  handleImageUpload: PropTypes.func.isRequired,

  images: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,

  thumbnailIndex: PropTypes.number.isRequired,

  setThumbnailIndex: PropTypes.func.isRequired,
};
