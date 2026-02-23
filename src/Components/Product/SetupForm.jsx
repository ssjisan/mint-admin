import { useEffect, useState } from "react";
import axios from "../../api/axios";
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
import Image from "./Form/Image";

export default function SetupForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [published, setPublished] = useState(true);
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [descriptionEditorKey, setDescriptionEditorKey] = useState(0);
  const [shortDescriptionEditorKey, setShortDescriptionEditorKey] = useState(0);
  const [descriptionEditorValue, setDescriptionEditorValue] = useState([
    { type: "paragraph", children: [{ text: "" }] },
  ]);
  const [shortDescriptionEditorValue, setShortDescriptionEditorValue] =
    useState([{ type: "paragraph", children: [{ text: "" }] }]);
  const [descriptionHtmlOutput, setDescriptionHtmlOutput] = useState("");
  const [shortDescriptionHtmlOutput, setShortDescriptionHtmlOutput] =
    useState("");
  const [descriptionEditorUploadedImages, setDescriptionEditorUploadedImages] =
    useState([]);
  const [
    shortDescriptionEditorUploadedImages,
    setShortDescriptionEditorUploadedImages,
  ] = useState([]);
  const [loading, setLoading] = useState(false);
  const [specifications, setSpecifications] = useState([
    {
      groupTitle: "",
      items: [{ label: "", value: "" }],
    },
  ]);
  const [images, setImages] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(null);

  // ------------------ Image Handler ------------------

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    const validFiles = files.filter((file) => file.size <= 2 * 1024 * 1024);

    if (validFiles.length !== files.length) {
      alert("Each file must be under 2MB");
    }

    setImages([...images, ...validFiles]);
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);

    // Adjust thumbnail selection logic
    if (thumbnailIndex === indexToRemove) {
      setThumbnailIndex(null); // Clear thumbnail if the selected one is deleted
    } else if (thumbnailIndex > indexToRemove) {
      setThumbnailIndex(thumbnailIndex - 1); // Shift index back if an earlier image was removed
    }
  };
  // ------------------ ------------------
  // ------------------ Spec Handlers
  //------------------ ------------------

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

  // ------------------ ------------------
  // ------------------ Fetch Products Data
  //------------------ ------------------

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

        // ================= DESCRIPTION =================
        let initialJSON = product.descriptionJSON;

        if (typeof initialJSON === "string") {
          try {
            initialJSON = JSON.parse(initialJSON);
          } catch (e) {
            console.error("Failed to parse descriptionJSON", e);
          }
        }

        if (!Array.isArray(initialJSON) || initialJSON.length === 0) {
          initialJSON = [{ type: "paragraph", children: [{ text: "" }] }];
        }

        const fixImageUrls = (nodes, slug) => {
          if (!Array.isArray(nodes)) return nodes;

          return nodes.map((node) => {
            // Fix image node
            if (node.type === "image" && node.url?.includes("/temp/")) {
              return {
                ...node,
                url: node.url.replace("/temp/", `/products/${slug}/`),
              };
            }

            // Recursively check children (safe for future nested structures)
            if (node.children) {
              return {
                ...node,
                children: fixImageUrls(node.children, slug),
              };
            }

            return node;
          });
        };

        // ================= SHORT DESCRIPTION =================
        let initialShortJSON = product.shortDescriptionJSON;

        if (typeof initialShortJSON === "string") {
          try {
            initialShortJSON = JSON.parse(initialShortJSON);
          } catch (e) {
            console.error("Failed to parse shortDescriptionJSON", e);
          }
        }

        if (!Array.isArray(initialShortJSON) || initialShortJSON.length === 0) {
          initialShortJSON = [{ type: "paragraph", children: [{ text: "" }] }];
        }
        // Set Images
        setImages(product.images || []);

        // Set thumbnail index
        const primaryIndex = (product.images || []).findIndex(
          (img) => img.isPrimary === true,
        );

        setThumbnailIndex(primaryIndex !== -1 ? primaryIndex : null);
        // Description
        // setDescriptionEditorValue(initialJSON);
        const fixedDescriptionJSON = fixImageUrls(initialJSON, product.slug);
        setDescriptionEditorValue(fixedDescriptionJSON);
        setDescriptionHtmlOutput(product.descriptionHTML || "");
        setDescriptionEditorKey((prev) => prev + 1);

        // Short Description
        // setShortDescriptionEditorValue(initialShortJSON);
        const fixedShortJSON = fixImageUrls(initialShortJSON, product.slug);
        setShortDescriptionEditorValue(fixedShortJSON);
        setShortDescriptionHtmlOutput(product.shortDescriptionHTML || "");
        setShortDescriptionEditorKey((prev) => prev + 1);
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
      const data = new FormData();
      if (isEditMode) data.append("id", id);
      data.append("name", formData.name);
      data.append("brand", formData.brand);
      data.append("category", formData.category);
      data.append("isPublished", published);
      data.append("price", Number(formData.price));
      data.append("showPrice", formData.showPrice);
      data.append("descriptionHTML", descriptionHtmlOutput);
      data.append("descriptionJSON", JSON.stringify(descriptionEditorValue));
      data.append("shortDescriptionHTML", shortDescriptionHtmlOutput);
      data.append(
        "shortDescriptionJSON",
        JSON.stringify(shortDescriptionEditorValue),
      );

      data.append(
        "discount",
        JSON.stringify({
          type: formData.discountType,
          value:
            formData.discountType === "none"
              ? 0
              : Number(formData.discountValue),
          isActive: formData.discountType !== "none",
        }),
      );

      data.append(
        "specifications",
        JSON.stringify(
          specifications.filter(
            (group) =>
              group.groupTitle.trim() !== "" &&
              group.items.some(
                (item) => item.label.trim() !== "" && item.value.trim() !== "",
              ),
          ),
        ),
      );
      const imageMetadata = [];

      images.forEach((img, index) => {
        const isPrimary = index === thumbnailIndex;

        if (img instanceof File) {
          data.append("productImages", img);
          imageMetadata.push({
            isPrimary,
            alt: formData.name,
            isNew: true, // Helper flag for backend logic
          });
        } else {
          imageMetadata.push({
            ...img,
            isPrimary,
            isNew: false,
          });
        }
      });

      // Send the metadata as a stringified array
      data.append("imageMetadata", JSON.stringify(imageMetadata));

      // 3. API Call
      await toast.promise(axios.post("/product-setup", data), {
        loading: isEditMode ? "Updating product..." : "Saving product...",
        success: () => {
          navigate("/product-list");
          return isEditMode
            ? "Product updated successfully"
            : "Product created successfully";
        },
        error: (err) => err?.response?.data?.error || "Operation failed",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred during submission.");
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
        shortDescriptionEditorKey={shortDescriptionEditorKey}
        shortDescriptionEditorValue={shortDescriptionEditorValue}
        setShortDescriptionEditorValue={setShortDescriptionEditorValue}
        setShortDescriptionHtmlOutput={setShortDescriptionHtmlOutput}
        shortDescriptionEditorUploadedImages={
          shortDescriptionEditorUploadedImages
        }
        setShortDescriptionEditorUploadedImages={
          setShortDescriptionEditorUploadedImages
        }
        descriptionEditorKey={descriptionEditorKey}
        descriptionEditorValue={descriptionEditorValue}
        setDescriptionEditorValue={setDescriptionEditorValue}
        setDescriptionHtmlOutput={setDescriptionHtmlOutput}
        descriptionEditorUploadedImages={descriptionEditorUploadedImages}
        setDescriptionEditorUploadedImages={setDescriptionEditorUploadedImages}
      />
      <Image
        handleImageUpload={handleImageUpload}
        images={images}
        thumbnailIndex={thumbnailIndex}
        setThumbnailIndex={setThumbnailIndex}
        handleRemoveImage={handleRemoveImage}
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
