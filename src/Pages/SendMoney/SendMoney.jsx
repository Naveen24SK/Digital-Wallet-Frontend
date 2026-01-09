import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Paper, Typography, Alert, Grid, Avatar, Chip, Divider, useTheme
} from "@mui/material";
import {
  ArrowBack, Send as SendIcon, PersonSearch, AccountBalanceWallet
} from "@mui/icons-material";

import API from "../../utils/api";
import PrimaryButton from "../../components/Ui/PrimaryButton";
import AmountInput from "../../components/Ui/AmountInput";
import CategorySelect from "../../components/Ui/CategorySelect";
import CustomTextField from "../../components/Ui/CustomTextField";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import ErrorAlert from "../../components/Ui/ErrorAlert";

const SendMoney = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [form, setForm] = useState({
    receiverAccountNumber: "",
    receiverName: "",
    amount: "",
    category: "others",
    purpose: ""
  });
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [receiverFound, setReceiverFound] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);

  const walletId = localStorage.getItem("walletId");

  useEffect(() => {
    if (!walletId) {
      setError("Wallet not found. Please create wallet first.");
      navigate("/app/dashboard");
      return;
    }
    fetchWalletBalance();
  }, [walletId]);

  const fetchWalletBalance = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await API.get(`/api/wallet/by-user/${userId}`);
      setWalletBalance(res.data.balance || 0);
      localStorage.setItem("walletId", res.data.id);
    } catch {
      setWalletBalance(0);
    }
  };

  const searchReceiver = async () => {
    if (!form.receiverAccountNumber || !form.receiverName) {
      setError("Please enter both account number and name");
      return;
    }

    setSearchLoading(true);
    setError("");
    try {
      const res = await API.get("/api/account/search", {
        params: {
          accountNumber: form.receiverAccountNumber,
          accountHolder: form.receiverName
        }
      });
      setReceiverFound(res.data);
    } catch (err) {
      setError("Receiver account not found");
      setReceiverFound(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendMoney = async () => {
    const amt = parseFloat(form.amount);

    if (!receiverFound) {
      setError("Please search and confirm receiver first");
      return;
    }
    if (!form.amount || amt < 1) {
      setError("Enter valid amount (minimum ₹1)");
      return;
    }
    if (amt > walletBalance) {
      setError(`Insufficient balance. Available: ₹${walletBalance.toLocaleString()}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await API.post("/api/wallet/send-money", {
        senderWalletId: parseInt(walletId),
        receiverAccountNumber: form.receiverAccountNumber,
        amount: amt,
        category: form.category.toUpperCase(),
        purpose: form.purpose
      });

      setSuccess(true);
      setForm({
        receiverAccountNumber: "",
        receiverName: "",
        amount: "",
        category: "others",
        purpose: ""
      });
      setReceiverFound(null);
      fetchWalletBalance();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send money");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Sending money..." />;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PrimaryButton
              onClick={() => navigate(-1)}
              variant="text"
              sx={{ p: 1, minWidth: "auto", borderRadius: '50%', color: theme.palette.text.secondary }}
            >
              <ArrowBack />
            </PrimaryButton>
            <Typography variant="h4" fontWeight={700}>
              Send Money
            </Typography>
          </Box>

          <Paper sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, px: 2.5, borderRadius: '20px', bgcolor: theme.palette.success.main + '10' }}>
            <AccountBalanceWallet sx={{ color: theme.palette.success.main }} />
            <Box>
              <Typography variant="caption" sx={{ color: theme.palette.success.main, fontWeight: 600, display: 'block' }}>
                Available
              </Typography>
              <Typography variant="body1" fontWeight={800} sx={{ color: theme.palette.success.dark }}>
                ₹{walletBalance.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Box>
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
              ✅ Money sent successfully!
              <Typography variant="caption" display="block">
                To: {receiverFound?.accountHolderName}
              </Typography>
            </Alert>
          )}

          {error && <ErrorAlert message={error} />}

          {/* Receiver Search */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: theme.palette.action.hover, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Find Receiver
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Account Number"
                  value={form.receiverAccountNumber}
                  onChange={(e) => setForm({ ...form, receiverAccountNumber: e.target.value })}
                  placeholder="ACC123456"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Account Holder"
                  value={form.receiverName}
                  onChange={(e) => setForm({ ...form, receiverName: e.target.value })}
                  placeholder="John Doe"
                />
              </Grid>
            </Grid>
            <PrimaryButton
              fullWidth
              onClick={searchReceiver}
              loading={searchLoading}
              sx={{ mt: 2 }}
              startIcon={<PersonSearch />}
              variant="outlined"
            >
              Search Account
            </PrimaryButton>

            {receiverFound && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="success" icon={false} sx={{ borderRadius: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {receiverFound.accountHolderName[0]}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">
                        {receiverFound.accountHolderName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {receiverFound.accountNumber}
                      </Typography>
                    </Box>
                  </Box>
                </Alert>
              </Box>
            )}
          </Paper>

          <Divider sx={{ my: 4 }}>
            <Chip label="Transaction Details" size="small" />
          </Divider>

          <AmountInput
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            disabled={loading}
          />

          <CategorySelect
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <CustomTextField
            label="Purpose (Optional)"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            multiline
            rows={2}
            placeholder="Payment for groceries..."
            sx={{ mt: 2 }}
          />

          <PrimaryButton
            fullWidth
            onClick={handleSendMoney}
            loading={loading}
            disabled={!receiverFound || !form.amount || loading}
            sx={{ mt: 4, py: 2 }}
            startIcon={<SendIcon />}
          >
            Send ₹{parseFloat(form.amount || 0).toLocaleString() || 0}
          </PrimaryButton>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Chip
              label="Instant • Secure • Free"
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

export default SendMoney;
