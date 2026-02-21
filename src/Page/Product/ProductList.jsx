import { Box, Toolbar, Typography, useMediaQuery } from "@mui/material";
import Sidebar from "../../Layout/Sidebar";
import ListTable from "../../Components/Product/ListTable";

export default function ProductList() {
  const drawerWidth = 260;
  const forBelow1200 = useMediaQuery("(min-width:1200px)");
  return (
    <Box>
      <Sidebar />
      <Box
        component="main"
        sx={{
          p: forBelow1200 ? 3 : 2,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
        <Box>
          <Typography variant="h5" sx={{ mb: "48px" }}>
            Product List
          </Typography>
          <ListTable />
        </Box>
      </Box>
    </Box>
  );
}
