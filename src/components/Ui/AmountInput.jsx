import { TextField, InputAdornment } from "@mui/material";
import { AccountBalanceWallet } from "@mui/icons-material";

const AmountInput = ({ value, onChange, disabled, error, helperText }) => (
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
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <AccountBalanceWallet sx={{ color: "#10b981 !important" }} />
        </InputAdornment>
      )
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
        background: "rgba(255,255,255,0.9)"
      }
    }}
  />
);

export default AmountInput;
