import SecondaryButton from "./SecondaryButton";
import { forwardRef } from "react";

const ActionButton = forwardRef(({ 
  children, 
  icon: Icon,
  variant = "contained",
  color,
  fullWidth,
  className = "",
  ...props 
}, ref) => (
  <SecondaryButton
    ref={ref}
    variant={variant}
    color={color}
    fullWidth={fullWidth}
    className={`action-btn ${className}`}
    startIcon={<Icon />}
    sx={{
      height: "64px !important",
      fontSize: "16px !important",
      fontWeight: "700 !important",
      ...props.sx
    }}
    {...props}
  >
    {children}
  </SecondaryButton>
));

ActionButton.displayName = "ActionButton";
export default ActionButton;
