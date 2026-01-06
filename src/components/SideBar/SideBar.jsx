import {
  Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Box, useTheme, Typography, Divider
} from "@mui/material";
import {
  Dashboard as HomeIcon,
  History as HistoryIcon,
  AddCircle as AddIcon,
  Send as SendIcon,
  Logout as LogoutIcon,
  AccountBalanceWallet
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/app/dashboard' },
    { text: 'History', icon: <HistoryIcon />, path: '/app/history' },
    { text: 'Add Money', icon: <AddIcon />, path: '/app/add-money' },
    { text: 'Send Money', icon: <SendIcon />, path: '/app/send-money' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <AccountBalanceWallet sx={{ fontSize: 40, color: theme.palette.primary.main }} />
        <Typography variant="h5" fontWeight="bold" color="primary">
          Wallet
        </Typography>
      </Box>
      <Divider />

      <List sx={{ flexGrow: 1, px: 2, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (mobileOpen) handleDrawerToggle();
              }}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: '12px',
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main + '20', // 20% opacity
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '30',
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  borderRadius: '12px',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 700 : 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            color: theme.palette.error.main,
            '&:hover': { backgroundColor: theme.palette.error.main + '10' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: theme.palette.error.main }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: 'none',
            background: theme.palette.background.paper,
            backdropFilter: 'blur(10px)'
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.default,
            top: 0
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
