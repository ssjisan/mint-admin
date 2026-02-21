import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Button,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import Basic from "./Form/Basic";
import Price from "./Form/Price";
import Spec from "./Form/Spec";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function SetupForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [published, setPublished] = useState(true);
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [descriptionEditorKey, setDescriptionEditorKey] = useState(0);
  const [descriptionEditorValue, setDescriptionEditorValue] = useState([
    { type: "paragraph", children: [{ text: "" }] },
  ]);
  const [descriptionHtmlOutput, setDescriptionHtmlOutput] = useState("");
  const [descriptionEditorUploadedImages, setDescriptionEditorUploadedImages] =
    useState([]);

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

  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`/products/${id}`);
        const product = res.data;
        let initialJSON = product.descriptionJSON;

        if (typeof initialJSON === "string") {
          try {
            initialJSON = JSON.parse(initialJSON);
          } catch (e) {
            console.error("Failed to parse descriptionJSON", e);
          }
        }

        if (
          !initialJSON ||
          !Array.isArray(initialJSON) ||
          initialJSON.length === 0
        ) {
          initialJSON = [{ type: "paragraph", children: [{ text: "" }] }];
        }

        // Set editor value
        setDescriptionEditorValue(initialJSON);
        setDescriptionHtmlOutput(product.descriptionHTML || "");

        // Reset editor
        setDescriptionEditorKey((prev) => prev + 1);
        // Set basic fields
        setFormData({
          name: product.name,
          brand: product.brand?._id,
          category: product.category?._id,
          descriptionHTML: product.descriptionHTML,
          price: product.price,
          showPrice: product.showPrice,
          discountType: product.discount?.type || "none",
          discountValue: product.discount?.value || "",
        });

        // Set specifications
        setSpecifications(product.specifications || []);

        // Set published
        setPublished(product.isPublished);
      } catch (error) {
        console.error("Fetch product failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ---------------------------
  // SUBMIT HANDLER
  // ---------------------------
  const handleSubmit = async () => {
    try {
      await toast.promise(
        axios.post("/product-setup", {
          id: isEditMode ? id : undefined, // 🔥 important

          name: formData.name,
          brand: formData.brand,
          category: formData.category,
          descriptionHTML: descriptionHtmlOutput,
          descriptionJSON: descriptionEditorValue,
          isPublished: published,

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
        }),
        {
          loading: isEditMode ? "Updating product..." : "Saving product...",
          success: () => {
            navigate("/product-list");
            return isEditMode
              ? "Product updated successfully"
              : "Product created successfully";
          },
          error: (err) => err?.response?.data?.error || "Operation failed",
        },
      );
    } catch (error) {
      toast.error(error);
    }
  };
  if (loading) {
    return <Typography>Loading....</Typography>;
  }
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Basic
        brands={brands}
        categories={categories}
        formData={formData}
        setFormData={setFormData}
        descriptionEditorKey={descriptionEditorKey}
        descriptionEditorValue={descriptionEditorValue}
        setDescriptionEditorValue={setDescriptionEditorValue}
        setDescriptionHtmlOutput={setDescriptionHtmlOutput}
        descriptionEditorUploadedImages={descriptionEditorUploadedImages}
        setDescriptionEditorUploadedImages={setDescriptionEditorUploadedImages}
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
          {isEditMode ? "Update Product" : "Submit Product"}
        </Button>
      </Grid>
    </Container>
  );
}
