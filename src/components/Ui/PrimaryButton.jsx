import { Button, CircularProgress, useTheme } from "@mui/material";
import { forwardRef } from "react";

const PrimaryButton = forwardRef(({
  children,
  loading = false,
  disabled = false,
  startIcon,
  className = "",
  fullWidth = true,
  ...props
}, ref) => {
  const theme = useTheme();

  return (
    <Button
      ref={ref}
      variant="contained"
      disabled={loading || disabled}
      fullWidth={fullWidth}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      sx={{
        borderRadius: "16px",
        padding: "14px 28px",
        fontSize: "1rem",
        fontWeight: "700",
        textTransform: "none",
        boxShadow: disabled ? 'none' : `0 8px 20px -4px ${theme.palette.primary.main}80`,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        transition: "all 0.3s ease",
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 12px 24px -4px ${theme.palette.primary.main}90`,
        },
        '&:active': {
          transform: 'translateY(1px)',
        },
        ...props.sx
      }}
      {...props}
    >
      {loading ? "Loading..." : children}
    </Button>
  );
});

PrimaryButton.displayName = "PrimaryButton";
export default PrimaryButton;
