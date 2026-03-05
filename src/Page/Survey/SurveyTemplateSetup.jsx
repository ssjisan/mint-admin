import { Toolbar, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import Sidebar from "../../Layout/Sidebar";
import ListView from "../../Components/Survey/Template/ListView";

export default function SurveyTemplateSetup() {
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
          <ListView />
        </Box>
      </Box>
    </Box>
  );
}
