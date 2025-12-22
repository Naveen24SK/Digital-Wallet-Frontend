import { Button, CircularProgress } from "@mui/material";
import { forwardRef } from "react";

const PrimaryButton = forwardRef(({ 
  children, 
  loading = false, 
  disabled = false, 
  startIcon, 
  className = "", 
  ...props 
}, ref) => (
  <Button
    ref={ref}
    variant="contained"
    disabled={loading || disabled}
    className={`primary-btn ${className}`}
    startIcon={loading ? <CircularProgress size={20} /> : startIcon}
    sx={{
      borderRadius: "25px !important",
      padding: "16px 32px !important",
      fontSize: "16px !important",
      fontWeight: "700 !important",
      textTransform: "none !important",
      boxShadow: "0 10px 30px rgba(102,126,234,0.4) !important",
      transition: "all 0.3s ease !important",
      ...props.sx
    }}
    {...props}
  >
    {loading ? "Loading..." : children}
  </Button>
));

PrimaryButton.displayName = "PrimaryButton";
export default PrimaryButton;
