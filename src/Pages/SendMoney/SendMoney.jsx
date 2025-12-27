import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Paper, Typography, Alert, Grid, Avatar, Chip, Divider 
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
import "./SendMoney.css";

const SendMoney = () => {
  const navigate = useNavigate();
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

if (!walletId) {
  setError("Wallet not found. Please create wallet first.");
  return;
}

const senderId = localStorage.getItem("userId");

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const res = await API.get(`/wallet/${walletId}`);
      setWalletBalance(res.data.balance || 0);
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
      // Search account by number + name
      const res = await API.get("/account/search", {
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
      const response = await API.post("/wallet/send-money", {
        senderWalletId: parseInt(walletId),
        receiverAccountNumber: form.receiverAccountNumber,
        amount: amt,
        category: form.category,
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
    <Box className="sendmoney-container">
      <Paper elevation={12} className="sendmoney-card">
        <Box className="header">
          <PrimaryButton 
            onClick={() => navigate(-1)} 
            variant="text"
            sx={{ p: 1, minWidth: "auto" }}
          >
            <ArrowBack />
          </PrimaryButton>
          <Typography variant="h4" className="title">
            Send Money
          </Typography>
        </Box>

        <Box className="wallet-balance">
          <AccountBalanceWallet sx={{ fontSize: 32, color: "#10b981" }} />
          <Typography variant="h6" fontWeight="bold">
            ₹{walletBalance.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Available Balance
          </Typography>
        </Box>

        <Box className="content">
          {success && (
            <Alert severity="success" className="success-alert">
              ✅ Money sent successfully!
              <br/>₹{form.amount} → {receiverFound?.accountHolderName}
            </Alert>
          )}

          {error && <ErrorAlert message={error} />}

          {/* Receiver Search */}
          <Paper elevation={4} className="search-section">
            <Typography variant="h6" sx={{ mb: 2 }}>
              Find Receiver
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <CustomTextField
                  label="Account Number"
                  value={form.receiverAccountNumber}
                  onChange={(e) => setForm({ ...form, receiverAccountNumber: e.target.value })}
                  placeholder="ACC123456"
                />
              </Grid>
              <Grid item xs={6}>
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
            >
              Search Account
            </PrimaryButton>

            {receiverFound && (
              <Box className="receiver-found">
                <Alert severity="success" icon={false}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#10b981" }}>
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

          <Divider sx={{ my: 4 }} />

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
          />

          <PrimaryButton
            fullWidth
            onClick={handleSendMoney}
            loading={loading}
            disabled={!receiverFound || !form.amount || loading}
            sx={{ mt: 3, py: 2 }}
            startIcon={<SendIcon />}
          >
            Send ₹{parseFloat(form.amount || 0).toLocaleString() || 0}
          </PrimaryButton>

          <Chip 
            label="Instant • Secure • Free" 
            color="success" 
            variant="outlined"
            className="info-chip"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default SendMoney;
