import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Basic from "./Form/Basic";
import Price from "./Form/Price";
import Spec from "./Form/Spec";

export default function SetupForm() {
  const [published, setPublished] = useState(true);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [specifications, setSpecifications] = useState([
    {
      groupTitle: "",
      items: [{ label: "", value: "" }],
    },
  ]);

  // ------------------ Spec Handlers ------------------

  const addGroup = () => {
    setSpecifications([
      ...specifications,
      { groupTitle: "", items: [{ label: "", value: "" }] },
    ]);
  };

  const removeGroup = (index) => {
    const updated = [...specifications];
    updated.splice(index, 1);
    setSpecifications(updated);
  };

  const addItem = (groupIndex) => {
    const updated = [...specifications];
    updated[groupIndex].items.push({ label: "", value: "" });
    setSpecifications(updated);
  };

  const removeItem = (groupIndex, itemIndex) => {
    const updated = [...specifications];
    updated[groupIndex].items.splice(itemIndex, 1);
    setSpecifications(updated);
  };

  const handleSpecChange = (groupIndex, itemIndex, field, value) => {
    const updated = [...specifications];
    updated[groupIndex].items[itemIndex][field] = value;
    setSpecifications(updated);
  };

  const handleGroupTitleChange = (index, value) => {
    const updated = [...specifications];
    updated[index].groupTitle = value;
    setSpecifications(updated);
  };

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    descriptionHTML: "",
    price: "",
    showPrice: true,
    discountType: "none",
    discountValue: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [brandRes, categoryRes] = await Promise.all([
          axios.get("/brands"),
          axios.get("/categories"),
        ]);

        setBrands(brandRes.data);
        setCategories(categoryRes.data);
      } catch (error) {
        console.error("API Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---------------------------
  // SUBMIT HANDLER
  // ---------------------------
  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        descriptionHTML: formData.descriptionHTML,
        descriptionJSON: JSON.stringify([
          {
            type: "paragraph",
            children: [{ text: formData.descriptionHTML }],
          },
        ]),
        isPublished: published,

        // PRICE PART
        price: Number(formData.price),
        showPrice: formData.showPrice,
        discount: {
          type: formData.discountType,
          value:
            formData.discountType === "none"
              ? 0
              : Number(formData.discountValue),
          isActive: formData.discountType !== "none",
        },
        specifications: specifications.filter(
          (group) =>
            group.groupTitle.trim() !== "" &&
            group.items.some(
              (item) => item.label.trim() !== "" && item.value.trim() !== "",
            ),
        ),
      };

      const res = await axios.post("/product-setup", payload);

      console.log("Saved:", res.data);
      alert("Product saved successfully");
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Failed to save product");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Basic
        brands={brands}
        categories={categories}
        formData={formData}
        setFormData={setFormData}
      />
      <Price formData={formData} setFormData={setFormData} />
      <Spec
        specifications={specifications}
        handleGroupTitleChange={handleGroupTitleChange}
        handleSpecChange={handleSpecChange}
        removeItem={removeItem}
        addItem={addItem}
        removeGroup={removeGroup}
        addGroup={addGroup}
      />
      <Grid container justifyContent="space-between" alignItems="center">
        <FormControlLabel
          control={
            <Switch
              checked={published}
              onChange={() => setPublished(!published)}
            />
          }
          label="Published"
        />

        <Button variant="contained" size="large" onClick={handleSubmit}>
          Submit Product
        </Button>
      </Grid>
    </Container>
  );
}
