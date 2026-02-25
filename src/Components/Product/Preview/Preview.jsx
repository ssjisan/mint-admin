import { Box, Container, Grid } from "@mui/material";
import ImageGallery from "./ImageGallery";
import BasicDetails from "./BasicDetails";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "../../../api/axios";
import DetailsPart from "./DetailsPart";

export default function Preview() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const detailsRef = useRef(null);

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  const sortedImages = product?.images
    ? [...product.images].sort(
        (a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0),
      )
    : [];
  const price = Number(product?.price || 0);

  let finalPrice = price;

  if (product?.discount?.isActive) {
    const { type, value } = product.discount;

    if (type === "fixed") {
      finalPrice = price - Number(value || 0);
    }

    if (type === "percentage") {
      finalPrice = price - (price * Number(value || 0)) / 100;
    }

    // Prevent negative price
    if (finalPrice < 0) finalPrice = 0;
    finalPrice = Math.ceil(finalPrice);
  }
  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <ImageGallery images={sortedImages} />
        </Grid>

        <Grid item xs={12} md={7}>
          <BasicDetails
            name={product.name}
            brand={product.brand}
            category={product.category}
            price={price}
            finalPrice={finalPrice}
            showPrice={product.showPrice}
            shortDescriptionHTML={product.shortDescriptionHTML}
            productCode={product.productCode}
            discount={product.discount}
            onViewMore={scrollToDetails}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <Box ref={detailsRef} sx={{ scrollMarginTop: "100px" }}>
            <DetailsPart
              descriptionHTML={product.descriptionHTML}
              specifications={product.specifications}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
