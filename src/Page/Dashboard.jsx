import { Box, Grid, Toolbar, useMediaQuery } from "@mui/material";
import Sidebar from "../Layout/Sidebar";
import MatrixCardDeck from "../Components/Dashboard/MatrixCardDeck";
import WelcomeCard from "../Components/Dashboard/WelcomeCard/WelcomeCard";
import ConnectionRequestPieChart from "../Components/Dashboard/Analytics/ConnectionRequestPieChart";
import PendingConnection from "../Components/Dashboard/PendingConnection/PendingConnection";

export default function Dashboard() {
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
          <WelcomeCard />
          <MatrixCardDeck />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <ConnectionRequestPieChart />
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8}>
              <PendingConnection />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
