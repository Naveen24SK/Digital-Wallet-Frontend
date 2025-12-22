import { TextField } from "@mui/material";
import { forwardRef } from "react";

// CustomTextField.jsx - ADD AUTOCOMPLETE PROP
const CustomTextField = forwardRef(({ 
  label, 
  autoComplete,  // ✅ ADD THIS PROP
  className = "", 
  fullWidth = true,
  variant = "outlined",
  size = "medium",
  ...props 
}, ref) => (
  <TextField
    ref={ref}
    label={label}
    fullWidth={fullWidth}
    variant={variant}
    size={size}
    autoComplete={autoComplete}  // ✅ PASS THROUGH
    className={`custom-textfield ${className}`}
    // ... rest of styles
    {...props}
  />
));

CustomTextField.displayName = "CustomTextField";
export default CustomTextField;
