import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import {
  Box, Paper, Typography, Button, TextField, CircularProgress, Alert, Chip
} from "@mui/material";
import { ArrowBack, Add as AddIcon, AccountBalanceWallet } from "@mui/icons-material";
import "./AddMoney.css";

const AddMoney = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const walletId = localStorage.getItem("walletId");

  const handleAddMoney = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await API.post("/api/wallet/add-money", {
        walletId: parseInt(walletId),
        amount: parseFloat(amount)
      });
      
      setWalletBalance(res.data.balance);
      setSuccess(true);
      setAmount("");
    } catch (err) {
      setError(err.response?.data || "Failed to add money");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="addmoney-container">
      <Paper className="addmoney-card" elevation={8}>
        <Box className="header">
          <Button onClick={() => navigate(-1)} className="back-btn">
            <ArrowBack />
          </Button>
          <Typography variant="h4" className="title">
            Add Money to Wallet
          </Typography>
        </Box>

        <Box className="content">
          {success && (
            <Alert severity="success" className="success-alert">
              ✅ ₹{amount} added successfully! New balance: ₹{walletBalance?.toLocaleString()}
            </Alert>
          )}

          {error && (
            <Alert severity="error" className="error-alert">
              {error}
            </Alert>
          )}

          <Box className="amount-input-section">
            <AccountBalanceWallet className="wallet-icon" />
            <TextField
              label="Enter Amount (₹)"
              variant="outlined"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="amount-input"
              type="number"
              inputProps={{ step: "0.01", min: "0.01" }}
              disabled={loading || success}
            />
          </Box>

          <Box className="action-buttons">
            <Button
              variant="contained"
              size="large"
              onClick={handleAddMoney}
              disabled={loading || !amount || success}
              className="add-btn"
              startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {loading ? "Adding..." : `Add ₹${amount || "0"}`}
            </Button>
            
            {!success && (
              <Chip 
                label="Minimum ₹10" 
                color="info" 
                size="medium"
                className="min-amount-chip"
              />
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddMoney;
