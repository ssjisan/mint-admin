import { Box, Toolbar, useMediaQuery } from "@mui/material";
import Sidebar from "../Layout/Sidebar";
import CategorySetup from "../Components/Category/CategorySetup";

export default function Category() {
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
          <CategorySetup />
        </Box>
      </Box>
    </Box>
  );
}
