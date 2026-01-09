import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Alert, Chip, Avatar, useTheme } from "@mui/material";
import { ArrowBack, Add as AddIcon, AccountBalanceWallet, Savings } from "@mui/icons-material";

import API from "../../utils/api";
import PrimaryButton from "../../components/Ui/PrimaryButton";
import AmountInput from "../../components/Ui/AmountInput";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import ErrorAlert from "../../components/Ui/ErrorAlert";

const AddMoney = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);

  const walletId = localStorage.getItem("walletId");
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
    try {
      const walletRes = await API.get(`api/wallet/by-user/${userId}`);
      setWalletBalance(walletRes.data.balance);
      localStorage.setItem("walletId", walletRes.data.id);

      const accRes = await API.get(`/api/account/by-user/${userId}`);
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
      const res = await API.post("/api/wallet/add-money", {
        accountId: Number(localStorage.getItem("accountId")),
        walletId: Number(localStorage.getItem("walletId")),
        amount: amt
      });

      setSuccess(true);
      setWalletBalance(res.data.balance);

      const accRes = await API.get(`/api/account/by-user/${userId}`);
      setAccountBalance(accRes.data.balance);

      setAmount("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add money");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !success) return <LoadingSpinner message="Adding money..." />;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: "32px",
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[4]
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1 }}>
          <PrimaryButton
            onClick={() => navigate(-1)}
            variant="text"
            sx={{ p: 1, minWidth: "auto", borderRadius: '50%', color: theme.palette.text.secondary }}
          >
            <ArrowBack />
          </PrimaryButton>
          <Typography variant="h4" fontWeight={800}>
            Add Money
          </Typography>
        </Box>

        {/* Balances Overview */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Paper
            elevation={0}
            sx={{
              flex: 1, p: 2, borderRadius: 4,
              display: 'flex', alignItems: 'center', gap: 2,
              bgcolor: theme.palette.primary.main + '10',
              border: `1px solid ${theme.palette.primary.main}30`
            }}
          >
            <Avatar sx={{ bgcolor: theme.palette.primary.main, color: '#fff' }}>
              <Savings />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">Bank Account</Typography>
              <Typography variant="h6" fontWeight="bold">
                ₹{accountBalance.toLocaleString()}
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              flex: 1, p: 2, borderRadius: 4,
              display: 'flex', alignItems: 'center', gap: 2,
              bgcolor: theme.palette.success.main + '10',
              border: `1px solid ${theme.palette.success.main}30`
            }}
          >
            <Avatar sx={{ bgcolor: theme.palette.success.main, color: '#fff' }}>
              <AccountBalanceWallet />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">Wallet</Typography>
              <Typography variant="h6" fontWeight="bold">
                ₹{walletBalance.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Box>
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
              ✅ ₹{amount} successfully added to your wallet!
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                New wallet balance: ₹{walletBalance.toLocaleString()}
              </Typography>
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

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Chip
              label="Secure • Instant Transfer"
              color="success"
              variant="outlined"
              size="small"
              sx={{ borderColor: theme.palette.success.main + '50', bgcolor: theme.palette.success.main + '05' }}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddMoney;
