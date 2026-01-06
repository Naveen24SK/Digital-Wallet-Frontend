import { TextField } from "@mui/material";
import { forwardRef } from "react";
import { useTheme } from "@mui/material/styles";

const CustomTextField = forwardRef(({
  label,
  autoComplete,
  className = "",
  fullWidth = true,
  variant = "outlined",
  size = "medium",
  ...props
}, ref) => {
  const theme = useTheme();

  return (
    <TextField
      ref={ref}
      label={label}
      fullWidth={fullWidth}
      variant={variant}
      size={size}
      autoComplete={autoComplete}
      slotProps={{
        input: {
          style: {
            borderRadius: '12px',
          }
        }
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          bgcolor: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.2)',
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.3)',
          },
          '&.Mui-focused': {
            bgcolor: theme.palette.mode === 'light' ? '#fff' : 'rgba(0,0,0,0.4)',
            boxShadow: `0 0 0 4px ${theme.palette.primary.main}20`
          }
        },
        ...props.sx
      }}
      {...props}
    />
  );
});

CustomTextField.displayName = "CustomTextField";
export default CustomTextField;
