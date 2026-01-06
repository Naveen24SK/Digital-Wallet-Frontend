import { Box, Typography, Paper, Avatar, useTheme } from "@mui/material";
import { forwardRef } from "react";

const BalanceCard = forwardRef(({
  title,
  balance,
  subtitle,
  icon: Icon,
  color = "primary",
  className = "",
  children,
  ...props
}, ref) => {
  const theme = useTheme();

  const getColor = (colorName) => {
    switch (colorName) {
      case "success": return theme.palette.success;
      case "warning": return theme.palette.warning;
      case "error": return theme.palette.error;
      default: return theme.palette.primary;
    }
  };

  const activeColor = getColor(color);

  return (
    <Paper
      ref={ref}
      elevation={0}
      sx={{
        borderRadius: "24px",
        padding: "40px 32px",
        textAlign: "center",
        background: theme.palette.mode === 'light'
          ? activeColor.main + '08' // very light tint
          : activeColor.main + '10', // slightly stronger in dark
        border: `1px solid ${activeColor.main}30`,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          borderColor: activeColor.main + '50',
          boxShadow: `0 10px 40px -10px ${activeColor.main}30`
        },
        ...props.sx
      }}
      {...props}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 3 }}>
        <Avatar sx={{
          width: 56,
          height: 56,
          bgcolor: activeColor.main + '20',
          color: activeColor.main
        }}>
          <Icon fontSize="large" />
        </Avatar>
        <Typography variant="h6" fontWeight="700" color="text.primary">
          {title}
        </Typography>
      </Box>

      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: "36px", md: "48px" },
          fontWeight: 900,
          background: `linear-gradient(135deg, ${activeColor.main}, ${activeColor.dark})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1
        }}
      >
        ₹{parseFloat(balance || 0).toLocaleString()}
      </Typography>

      <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 600, mb: 2 }}>
        {subtitle}
      </Typography>

      {children}
    </Paper>
  );
});

BalanceCard.displayName = "BalanceCard";
export default BalanceCard;
