import { TextField, InputAdornment, useTheme } from "@mui/material";
import { AccountBalanceWallet } from "@mui/icons-material";

const AmountInput = ({ value, onChange, disabled, error, helperText }) => {
  const theme = useTheme();

  return (
    <TextField
      label="Amount (₹)"
      type="number"
      value={value}
      onChange={(e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val)) {
          onChange(e);
        }
      }}
      disabled={disabled}
      error={error}
      helperText={helperText}
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountBalanceWallet sx={{ color: theme.palette.success.main }} />
            </InputAdornment>
          )
        }
      }}
      inputProps={{
        step: "0.01",
        maxLength: 10,
        min: 1,
        inputMode: "decimal",
        pattern: "[0-9]*"
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "20px",
          bgcolor: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.2)',
          '& fieldset': {
            borderColor: error ? theme.palette.error.main : theme.palette.divider,
          },
          '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: 2
          }
        }
      }}
    />
  );
};

export default AmountInput;
