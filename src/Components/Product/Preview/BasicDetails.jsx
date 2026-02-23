import { Container, Typography } from "@mui/material";
import NewsContentRenderer from "../../lib/html2text";

export default function BasicDetails({
  name,
  brand,
  category,
  price,
  shortDescriptionHTML,
  productCode,
}) {
  return (
    <Container>
      <Typography>{name}</Typography>
      <NewsContentRenderer html={shortDescriptionHTML} />
    </Container>
  );
}
