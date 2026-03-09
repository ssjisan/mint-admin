"use client";

import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { Grid, Typography, Box, Stack } from "@mui/material";

export default function DashboardOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get("/dashboard-overview");
        setData(res.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchOverview();
  }, []);

  const stats = [
    {
      label: "Total Submissions",
      value: data?.totalSubmissions,
      img: "checklist.png",
    },
    {
      label: "Today's Submissions",
      value: data?.todaySubmissions,
      img: "april.png",
    },
    {
      label: "Month Submissions",
      value: data?.monthSubmissions,
      img: "calendar.png",
    },
    { label: "Average Score", value: data?.averageScore, img: "average.png" },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Box
            elevation={3}
            sx={{
              borderRadius: "16px",
              boxShadow:
                "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
              p: "40px 24px",
              display: "flex",
              gap: "24px",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "64px", height: "64px" }}>
              <img src={stat.img} style={{ width: "100%" }} />
            </Box>
            <Stack>
              <Typography variant="h4">{stat.value ?? "-"}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {stat.label}
              </Typography>
            </Stack>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
