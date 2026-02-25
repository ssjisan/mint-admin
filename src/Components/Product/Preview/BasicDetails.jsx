import { Button, Chip, Container, Stack, Typography } from "@mui/material";
import NewsContentRenderer from "../../lib/html2text";
import PropTypes from "prop-types";
export default function BasicDetails({
  name,
  brand,
  price,
  finalPrice,
  shortDescriptionHTML,
  productCode,
  showPrice,
  discount,
  onViewMore,
}) {
  return (
    <Container sx={{ p: "24px" }}>
      <Stack sx={{ width: "480px", mb: "8px" }}>
        <Typography variant="h3">{name}</Typography>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: "16px" }}
      >
        {/* Brand Chip */}
        {brand?.name && (
          <Chip
            label={
              <Stack direction="row" spacing={0.5}>
                <Typography
                  variant="body2"
                  sx={{ color: "#666666", fontWeight: 500 }}
                >
                  Brand:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.primary", fontWeight: 600 }}
                >
                  {brand?.name}
                </Typography>
              </Stack>
            }
            sx={{
              backgroundColor: "rgba(121, 45, 248, 0.08)",
              border: "1px solid rgba(121, 45, 248, 0.2)",
              borderRadius: "8px",
              height: 32,
            }}
          />
        )}
        {/* Product Code Chip */}
        {productCode && (
          <Chip
            label={
              <Typography
                variant="body2"
                sx={{ color: "#666666", fontWeight: 500 }}
              >
                {productCode}
              </Typography>
            }
            sx={{
              backgroundColor: "rgba(121, 45, 248, 0.08)",
              border: "1px solid rgba(121, 45, 248, 0.2)",
              borderRadius: "8px",
              height: 32,
            }}
          />
        )}
      </Stack>
      <Stack sx={{ mb: "16px" }}>
        {showPrice ? (
          discount?.isActive ? (
            <Stack flexDirection={"row"} gap="12px" alignItems={"center"}>
              <Typography variant="h3" color="primary">
                ৳{finalPrice}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  textDecoration: "line-through",
                  color: "text.secondary",
                }}
              >
                ৳{price}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="h3">৳{price}</Typography>
          )
        ) : (
          <Typography variant="h5">Call us for details price</Typography>
        )}
      </Stack>
      <Button variant="contained">Pre-order</Button>
      <NewsContentRenderer html={shortDescriptionHTML} />
      <Button onClick={onViewMore} sx={{ textDecoration: "underline" }}>
        View more details
      </Button>
    </Container>
  );
}
BasicDetails.propTypes = {
  name: PropTypes.string.isRequired,
  brand: PropTypes.shape({
    name: PropTypes.string,
  }),
  category: PropTypes.object,
  price: PropTypes.number.isRequired,
  finalPrice: PropTypes.number,
  shortDescriptionHTML: PropTypes.string,
  productCode: PropTypes.string,
  showPrice: PropTypes.bool,
  discount: PropTypes.shape({
    type: PropTypes.oneOf(["none", "percentage", "fixed"]),
    value: PropTypes.number,
    isActive: PropTypes.bool,
  }),
  onViewMore: PropTypes.func,
};
