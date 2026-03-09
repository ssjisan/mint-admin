import { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import Chart from "react-apexcharts";
import axios from "../../../api/axios";

export default function DashboardCategoriesPieChart() {
  const isSmallScreen = useMediaQuery("(max-width:776px)");

  const [series, setSeries] = useState([]);
  const [rawCounts, setRawCounts] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  const options = {
    chart: {
      type: "pie",
      fontFamily: "Public Sans, sans-serif",
    },
    labels: labels,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`,
    },
    tooltip: {
      y: {
        formatter: (val, { seriesIndex }) => {
          return `${rawCounts[seriesIndex]} Items`;
        },
      },
    },
    colors: ["#2ecc71", "#3498db", "#f1c40f", "#e67e22", "#e74c3c"],
  };

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get("/dashboard-overview");
        const categories = res.data?.data?.categories;

        if (!categories) return;

        const labelsArr = Object.keys(categories);
        const valuesArr = Object.values(categories);

        const total = valuesArr.reduce((a, b) => a + b, 0);

        const percentages = valuesArr.map((v) =>
          total ? +((v / total) * 100).toFixed(2) : 0,
        );

        setLabels(labelsArr);
        setSeries(percentages);
        setRawCounts(valuesArr);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const chartLabels = labels.map((label, index) => (
    <Box
      key={label}
      display="flex"
      gap={1}
      justifyContent="center"
      alignItems="center"
    >
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: options.colors[index],
        }}
      />

      <Typography variant="subtitle2">
        {label}: {series[index] || 0}%
      </Typography>
    </Box>
  ));

  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow:
          "0px 0px 2px rgba(145,158,171,0.2), 0px 12px 24px -4px rgba(145,158,171,0.12)",
      }}
    >
      <CardContent>
        <Typography variant="h6" mb={2}>
          Category Distribution
        </Typography>

        <Box
          width={isSmallScreen ? "100%" : "65%"}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
          mx="auto"
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Chart options={options} series={series} type="pie" width="100%" />
          )}
        </Box>

        {!loading && (
          <Stack
            direction="row"
            justifyContent="center"
            flexWrap="wrap"
            gap="24px"
            sx={{
              borderTop: "1px solid rgba(145, 142, 175, 0.24)",
              mt: 3,
              pt: 2,
            }}
          >
            {chartLabels}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
