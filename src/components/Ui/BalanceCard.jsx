import { Box, Typography, Chip, Paper, Avatar } from "@mui/material";
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
  const colors = {
    primary: { bg: "#667eea15", border: "#667eea20", icon: "#667eea" },
    success: { bg: "#10b98115", border: "#10b98120", icon: "#10b981" },
    warning: { bg: "#f59e0b15", border: "#f59e0b20", icon: "#f59e0b" }
  };

  return (
    <Paper
      ref={ref}
      className={`balance-card ${className}`}
      elevation={0}
      sx={{
        height: "280px",
        borderRadius: "24px !important",
        padding: "40px 32px",
        textAlign: "center",
        background: colors[color].bg,
        border: `1px solid ${colors[color].border}`,
        ...props.sx
      }}
      {...props}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 3 }}>
        <Avatar sx={{ 
          width: 48, 
          height: 48, 
          bgcolor: colors[color].icon + "20",
          color: colors[color].icon 
        }}>
          <Icon fontSize="large" />
        </Avatar>
        <Typography variant="h6" fontWeight="700">
          {title}
        </Typography>
      </Box>
      
      <Typography 
        variant="h2" 
        sx={{ 
          fontSize: { xs: "36px", md: "48px" },
          fontWeight: "900 !important",
          background: `linear-gradient(135deg, ${colors[color].icon}, #3f51b5)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1
        }}
      >
        ₹{parseFloat(balance || 0).toLocaleString()}
      </Typography>
      
      <Typography variant="body1" sx={{ color: "#666", fontWeight: "600", mb: 2 }}>
        {subtitle}
      </Typography>
      
      {children}
    </Paper>
  );
});

BalanceCard.displayName = "BalanceCard";
export default BalanceCard;
