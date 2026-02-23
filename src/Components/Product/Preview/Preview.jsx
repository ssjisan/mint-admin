import { Container, Grid } from "@mui/material";
import ImageGallery from "./ImageGallery";
import BasicDetails from "./BasicDetails";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../../api/axios";

export default function Preview() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <ImageGallery images={product.images || []} />
        </Grid>

        <Grid item xs={12} md={5}>
          <BasicDetails
            name={product.name}
            brand={product.brand}
            category={product.category}
            price={product.price}
            shortDescriptionHTML={product.shortDescriptionHTML}
            productCode={product.productCode}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
