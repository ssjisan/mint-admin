import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../api/axios";

import Form from "./Form";

export default function Add() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [packageName, setPackageName] = useState("");
  const [price, setPrice] = useState("");
  const [speedMbps, setSpeedMbps] = useState("");
  const [type, setType] = useState("residential");

  const [items, setItems] = useState([{ id: Date.now(), title: "" }]);

  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch (Edit mode) ---------------- */
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`/package/${id}`);
        const data = res.data;

        setPackageName(data.packageName || "");
        setPrice(data.price || "");
        setSpeedMbps(data.speedMbps || "");
        setType(data.type || "residential");
        setItems(
          data.items?.length ? data.items : [{ id: Date.now(), title: "" }],
        );
      } catch {
        toast.error("Failed to load package");
      }
    };

    fetchData();
  }, [id]);

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        id,
        packageName,
        price: Number(price),
        speedMbps: Number(speedMbps),
        type,
        items: items.filter((i) => i.title.trim() !== ""),
      };

      const { data } = await axios.post("/package", payload);

      toast.success(data.message);
      navigate("/package-list");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        {id ? "Edit Package" : "Add Package"}
      </Typography>

      <Stack sx={{ width: { md: "48%" } }}>
        <Form
          packageName={packageName}
          setPackageName={setPackageName}
          price={price}
          setPrice={setPrice}
          speedMbps={speedMbps}
          setSpeedMbps={setSpeedMbps}
          type={type}
          setType={setType}
          items={items}
          setItems={setItems}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Stack>
    </Box>
  );
}
