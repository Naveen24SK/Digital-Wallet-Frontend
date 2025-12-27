import { Box, Typography, Chip, Divider } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const TransactionSuccess = ({ amount, newBalance, type = "add", category }) => (
  <Box sx={{ 
    p: 4, 
    textAlign: "center", 
    background: "linear-gradient(135deg, #10b98115 0%, #05966915 100%)",
    borderRadius: "20px",
    border: "1px solid #10b98120"
  }}>
    <CheckCircle sx={{ fontSize: 64, color: "#10b981", mb: 2 }} />
    <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
      Success!
    </Typography>
    <Typography variant="h6" sx={{ mb: 3, color: "#059669" }}>
      ₹{parseFloat(amount).toLocaleString()} {type === "add" ? "added" : "sent"}
    </Typography>
    
    <Divider sx={{ my: 2 }} />
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary">New Balance</Typography>
      <Chip 
        label={`₹${parseFloat(newBalance).toLocaleString()}`} 
        color="success" 
        size="large"
        sx={{ mt: 1, fontSize: "18px", fontWeight: 700, height: "44px" }}
      />
    </Box>
    
    {category && (
      <Chip 
        label={category.label || category} 
        color={category.color || "default"} 
        size="medium"
        sx={{ mt: 2 }}
      />
    )}
  </Box>
);

export default TransactionSuccess;
