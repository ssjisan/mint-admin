import { Grid, Toolbar, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import Sidebar from "../../Layout/Sidebar";
import ListView from "../../Components/Survey/KpiCategory/ListView";
import DashboardOverview from "../../Components/Survey/Dashboard/DashboardOverview";
import TemplateWisePerformance from "../../Components/Survey/Dashboard/TemplateWisePerformance";
import DashboardCategoriesPieChart from "../../Components/Survey/Dashboard/DashboardCategoriesPieChart";
import KpiPerformance from "./KpiPerformance";
import QuestionBasedData from "./QuestionBasedData";

export default function SurveyDashboard() {
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
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <DashboardOverview />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <DashboardCategoriesPieChart />
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <KpiPerformance />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TemplateWisePerformance />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <QuestionBasedData />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
