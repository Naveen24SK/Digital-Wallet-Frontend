import { AppBar, Toolbar, Typography, IconButton, Box, useTheme, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useThemeContext } from "../../context/ThemeContext";

const Topbar = ({ handleDrawerToggle }) => {
  const theme = useTheme();
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'transparent',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' }, color: theme.palette.text.primary }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: theme.palette.primary.main, fontWeight: 800 }}>
          WalletApp
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={toggleColorMode} sx={{ color: theme.palette.text.primary }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>N</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
