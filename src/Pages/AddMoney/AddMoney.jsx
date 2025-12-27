import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Alert, Chip, Avatar, LinearProgress } from "@mui/material";
import { ArrowBack, Add as AddIcon, AccountBalanceWallet, Savings } from "@mui/icons-material";

import API from "../../utils/api";
import PrimaryButton from "../../components/Ui/PrimaryButton";
import AmountInput from "../../components/Ui/AmountInput";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import ErrorAlert from "../../components/Ui/ErrorAlert";
import "./AddMoney.css";

const AddMoney = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);

const walletId = localStorage.getItem("walletId");
const accountId = localStorage.getItem("accountId");
const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/app/dashboard");
      return;
    }
    fetchBalances();
  }, [userId, navigate]);

  useEffect(() => {
  if (!walletId) {
    setError("Wallet not found. Please create wallet first.");
    navigate("/app/dashboard");
  }
}, [walletId, navigate]);


const fetchBalances = async () => {
  const userId = localStorage.getItem("userId");

  try {
    const walletRes = await API.get(`/wallet/by-user/${userId}`);
    setWalletBalance(walletRes.data.balance);
    localStorage.setItem("walletId", walletRes.data.id);

    const accRes = await API.get(`/account/by-user/${userId}`);
    setAccountBalance(accRes.data.balance);
    localStorage.setItem("accountId", accRes.data.id);

  } catch (err) {
    console.error("Failed to fetch balances", err);
  }
};


const handleAddMoney = async () => {
  const amt = Number(amount);

  if (!amt || amt < 1) {
    setError("Minimum amount is ₹1");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await API.post("/wallet/add-money", {
      accountId: Number(localStorage.getItem("accountId")),
      walletId: Number(localStorage.getItem("walletId")),
      amount: amt
    });

    setWalletBalance(res.data.balance);
    setSuccess(true);
    setWalletBalance(res.data.balance);

// 🔹 refresh account balance
    const accRes = await API.get(`/account/by-user/${userId}`);
    setAccountBalance(accRes.data.balance);

    setAmount("");

  } catch (err) {
    setError(
      err.response?.data?.message || "Failed to add money"
    );
  } finally {
    setLoading(false);
  }
};

  if (loading && !success) return <LoadingSpinner message="Adding money..." />;

  return (
    <Box className="addmoney-container">
      <Paper elevation={12} className="addmoney-card">
        {/* Header */}
        <Box className="header">
          <PrimaryButton 
            onClick={() => navigate(-1)} 
            variant="text"
            sx={{ p: 1, minWidth: "auto" }}
          >
            <ArrowBack />
          </PrimaryButton>
          <Typography variant="h4" className="title">
            Add Money
          </Typography>
        </Box>

        {/* Balances Overview */}
        <Box className="balances-overview">
          <Box className="balance-item">
            <Avatar sx={{ bgcolor: "#667eea" }}>
              <Savings />
            </Avatar>
            <div>
              <Typography variant="body2" color="text.secondary">Bank Account</Typography>
              <Typography variant="h5" fontWeight="bold">
                ₹{accountBalance.toLocaleString()}
              </Typography>
            </div>
          </Box>
          <Box className="balance-item">
            <Avatar sx={{ bgcolor: "#10b981" }}>
              <AccountBalanceWallet />
            </Avatar>
            <div>
              <Typography variant="body2" color="text.secondary">Wallet</Typography>
              <Typography variant="h5" fontWeight="bold">
                ₹{walletBalance.toLocaleString()}
              </Typography>
            </div>
          </Box>
        </Box>

        <Box className="content">
          {success && (
            <Alert severity="success" className="success-alert">
              ✅ ₹{amount} successfully added to your wallet!
              <br/>New wallet balance: ₹{walletBalance.toLocaleString()}
            </Alert>
          )}

          {error && <ErrorAlert message={error} />}

          <AmountInput
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading || success}
            error={!!error}
            helperText={error ? error : "Minimum ₹10"}
          />

          <PrimaryButton
            fullWidth
            onClick={handleAddMoney}
            loading={loading}
            disabled={success || !amount}
            sx={{ mt: 3, py: 2 }}
            startIcon={<AddIcon />}
          >
            Add ₹{parseFloat(amount || 0).toLocaleString() || 0}
          </PrimaryButton>

          <Chip 
            label="Secure • Instant Transfer" 
            color="success" 
            variant="outlined"
            className="info-chip"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default AddMoney;
