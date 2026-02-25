import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

export default function ImageGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Set initial active image (isPrimary)
  useEffect(() => {
    if (!images.length) return;

    const primaryIndex = images.findIndex((img) => img.isPrimary);
    setActiveIndex(primaryIndex !== -1 ? primaryIndex : 0);
  }, [images]);

  if (!images.length) return <div>No images available</div>;

  const activeImage = images[activeIndex];

  return (
    <Box>
      {/* Main Image */}
      <Box
        sx={{
          width: "100%",
          height: 480,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <img
          src={activeImage.url}
          alt={activeImage.alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Thumbnails */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mt: 2,
          flexWrap: "wrap",
        }}
      >
        {images.map((img, index) => (
          <Box
            key={img._id?.$oid || index}
            onClick={() => setActiveIndex(index)}
            sx={{
              width: 80,
              height: 80,
              borderRadius: 2,
              overflow: "hidden",
              cursor: "pointer",
              border:
                activeIndex === index
                  ? "2px solid #1976d2"
                  : "1px solid #e0e0e0",
              transition: "all 0.2s ease",
            }}
          >
            <img
              src={img.url}
              alt={img.alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          $oid: PropTypes.string,
        }),
      ]),
      url: PropTypes.string.isRequired,
      alt: PropTypes.string,
      isPrimary: PropTypes.bool,
    }),
  ),
};
