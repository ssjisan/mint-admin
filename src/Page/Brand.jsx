import { Box, Toolbar, useMediaQuery } from "@mui/material";
import Sidebar from "../Layout/Sidebar";
import BrandSetup from "../Components/Brand/BrandSetup";

export default function Brand() {
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
          <BrandSetup />
        </Box>
      </Box>
    </Box>
  );
}
