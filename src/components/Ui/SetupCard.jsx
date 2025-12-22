import { Box, Paper, Typography } from "@mui/material";
import { forwardRef } from "react";

const SetupCard = forwardRef(({ 
  title, 
  description, 
  icon: Icon,
  gradient = "primary",
  children,
  className = "",
  ...props 
}, ref) => {
  const gradients = {
    primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    success: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    warning: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  };

  return (
    <Paper
      ref={ref}
      className={`setup-card ${className}`}
      elevation={12}
      sx={{
        maxWidth: "700px",
        mx: "auto",
        borderRadius: "28px !important",
        p: { xs: "40px 24px", md: "60px 48px" },
        background: gradients[gradient],
        color: "white",
        textAlign: "center",
        boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
        ...props.sx
      }}
      {...props}
    >
      <Icon sx={{ fontSize: { xs: "60px", md: "90px" }, mb: 3, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))" }} />
      <Typography 
        variant="h3" 
        sx={{ 
          fontSize: { xs: "24px", md: "32px" },
          fontWeight: "900 !important",
          mb: 2,
          textShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ fontSize: "18px", opacity: 0.95, mb: 5, lineHeight: 1.6 }}>
        {description}
      </Typography>
      {children}
    </Paper>
  );
});

SetupCard.displayName = "SetupCard";
export default SetupCard;
