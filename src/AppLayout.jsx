import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import Sidebar from "./components/SideBar/SideBar";
import Topbar from "./components/TopBar/TopBar";
import "./App.css";

const drawerWidth = 240;

const AppLayout = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      navigate("/");
    }
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar for Desktop & Mobile */}
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <Topbar handleDrawerToggle={handleDrawerToggle} />

        {/* Page Content Container */}
        <Box
          sx={{
            mt: 3,
            flexGrow: 1,
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
