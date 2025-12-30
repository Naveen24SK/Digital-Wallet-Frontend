import { Alert, Chip, Box, Typography } from "@mui/material";
import { NotificationsActive } from "@mui/icons-material";

const LowBalanceAlert = ({ balance, minBalance = 100 }) => {
  const isLow = balance < minBalance;
  
  if (!isLow) return null;

  return (
    <Alert 
      severity="warning" 
      icon={<NotificationsActive />}
      sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}
    >
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Low Wallet Balance
        </Typography>
        <Typography sx={{ mb: 1 }}>
          Current: <Chip label={`₹${balance.toLocaleString()}`} color="warning" size="small" />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Minimum balance is ₹{minBalance.toLocaleString()}. 
          Add money or set up auto-topup to avoid service interruptions.
        </Typography>
      </Box>
    </Alert>
  );
};

export default LowBalanceAlert;
