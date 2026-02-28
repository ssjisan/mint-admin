import { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import { Edit, Delete, Folder, Description } from "@mui/icons-material";
import axios from "../../api/axios";

export default function PageList() {
  const [allData, setAllData] = useState([]);
  const [tabValue, setTabValue] = useState(0); // 0 = Pages, 1 = Groups

  const fetchPages = async () => {
    try {
      const res = await axios.get("/resource-list");
      setAllData(res.data);
    } catch (err) {
      console.error("Error fetching pages:", err);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter data based on Tab
  const filteredData = allData.filter((item) =>
    tabValue === 0 ? !item.isGroup : item.isGroup,
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Platform Resources
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label={`Pages (${allData.filter((i) => !i.isGroup).length})`} />
        <Tab label={`Groups (${allData.filter((i) => i.isGroup).length})`} />
      </Tabs>

      <TableContainer sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f4f6f8" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Path / Slug</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {tabValue === 0 ? "Parent Group" : "Status"}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item._id} hover>
                <TableCell>
                  <Chip
                    label={item.order}
                    size="small"
                    color="primary"
                    variant="filled"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {item.isGroup ? (
                      <Folder color="primary" />
                    ) : (
                      <Description color="action" />
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" display="block">
                    {item.path || "No Path"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    slug: {item.slug}
                  </Typography>
                </TableCell>
                <TableCell>
                  {tabValue === 0 ? (
                    item.parentId ? (
                      <Chip
                        label={item.parentId.title}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="caption" color="text.disabled">
                        Top Level
                      </Typography>
                    )
                  ) : (
                    <Chip label="Active Group" size="small" color="success" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary">
                    <Edit fontSize="inherit" />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <Delete fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
