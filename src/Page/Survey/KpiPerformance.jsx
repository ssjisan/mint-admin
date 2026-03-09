"use client";

import Chart from "react-apexcharts";
import { Card, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function KpiPerformance() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchKpi = async () => {
      try {
        const res = await axios.get("/dashboard-kpi-performance");
        setData(res.data.data || []);
      } catch (error) {
        console.error("Error fetching KPI performance:", error);
      }
    };

    fetchKpi();
  }, []);

  const labels = data.map((item) => item.kpiName);
  const series = [
    {
      name: "Performance",
      data: data.map((item) => item.percentage),
    },
  ];

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Public Sans, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
        borderRadius: 6,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
    },
    xaxis: {
      categories: labels,
      max: 100,
      axisBorder: {
        show: false, // ❌ remove bottom line
      },
      axisTicks: {
        show: false, // ❌ remove ticks
      },
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "Public Sans, sans-serif",
          fontSize: "13px",
          fontWeight: 500,
        },
      },
    },
    colors: ["#4CAF50"],
    grid: {
      strokeDashArray: 4,
    },
  };

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
          KPI Performance
        </Typography>

        <Chart options={options} series={series} type="bar" height={300} />
      </CardContent>
    </Card>
  );
}
