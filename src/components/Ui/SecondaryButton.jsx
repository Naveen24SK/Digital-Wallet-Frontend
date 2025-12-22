import { Button } from "@mui/material";
import { forwardRef } from "react";

const SecondaryButton = forwardRef(({ 
  children, 
  variant = "outlined", 
  color = "primary",
  className = "",
  ...props 
}, ref) => (
  <Button
    ref={ref}
    variant={variant}
    color={color}
    className={`secondary-btn ${className}`}
    sx={{
      borderRadius: "16px !important",
      padding: "14px 24px !important",
      fontSize: "15px !important",
      fontWeight: "600 !important",
      textTransform: "none !important",
      height: "56px !important",
      borderWidth: "2px !important",
      ...props.sx
    }}
    {...props}
  >
    {children}
  </Button>
));

SecondaryButton.displayName = "SecondaryButton";
export default SecondaryButton;
