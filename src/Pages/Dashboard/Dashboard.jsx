import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid, Box, Typography, Avatar, Paper, Select, MenuItem, 
  FormControl, InputLabel, useTheme, Chip, TextField, Button, Alert
} from "@mui/material";
import {
  AccountBalanceWallet, Wallet as WalletIcon, Add, Send, History,
  Person, BarChart as AnalyticsIcon, Email as EmailIcon
} from "@mui/icons-material";
import API from "../../utils/api";

// UI Components
import SetupCard from "../../components/Ui/SetupCard";
import PrimaryButton from "../../components/Ui/PrimaryButton";
import CustomTextField from "../../components/Ui/CustomTextField";
import BalanceCard from "../../components/Ui/BalanceCard";
import ActionButton from "../../components/Ui/ActionButton";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import ErrorAlert from "../../components/Ui/ErrorAlert";
import StandaloneCharts from "../../components/Charts/SpendingCharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const userId = localStorage.getItem("userId");
  const walletId = localStorage.getItem("walletId");

  // States
  const [step, setStep] = useState("loading");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [account, setAccount] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState("week");
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // ✅ Min Balance Alert States
  const [minBalance, setMinBalance] = useState("");

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    if (wallet?.id) {
      fetchAnalytics();
    }
  }, [wallet, period]);

  const fetchUserData = async () => {
    try {
      console.log("🔍 Fetching user data for userId:", userId);
      
      try {
        const accRes = await API.get(`/api/account/by-user/${userId}`);
        setAccount(accRes.data);
        setStep("create-wallet");
      } catch (err) {
        if (err.response?.status === 404) {
          setStep("create-account");
          setLoading(false);
          return;
        }
        throw err;
      }

      try {
        const walletRes = await API.get(`/api/wallet/by-user/${userId}`);
        const walletData = walletRes.data;
        setWallet(walletData);
        localStorage.setItem("walletId", walletData.id.toString());
        
        // ✅ Initialize minBalance from wallet data
        if (walletData.minBalance) {
          setMinBalance(walletData.minBalance.toString());
        }
        
        setStep("ready");
      } catch (err) {
        if (err.response?.status === 404) {
          setStep("create-wallet");
          setLoading(false);
          return;
        }
        throw err;
      }
    } catch (err) {
      console.error("Dashboard load failed:", err);
      setError("Failed to load dashboard. Please refresh.");
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!walletId) return;
    setAnalyticsLoading(true);
    try {
      const res = await API.get(`/api/wallet/analytics/${walletId}?period=${period}`);
      setAnalytics(res.data);
    } catch (err) {
      console.error("Analytics fetch failed:", err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // ✅ FIXED saveMinBalance function
  const saveMinBalance = async () => {
    if (!walletId || !minBalance || parseFloat(minBalance) <= 0) {
      console.error("❌ Invalid min balance:", minBalance);
      return;
    }

    try {
      console.log("💾 Saving min balance:", minBalance, "for wallet:", walletId);
      
      const response = await API.put(`/api/wallet/${walletId}/min-balance`, {
        minBalance: parseFloat(minBalance)
      });
      
      console.log("✅ Min balance saved:", response.data);
      
      // Refresh wallet data
      const walletRes = await API.get(`/api/wallet/by-user/${userId}`);
      setWallet(walletRes.data);
      
      // Success feedback
      // You can replace alert with toast notification
      alert(`✅ Alert threshold set to ₹${parseFloat(minBalance).toLocaleString()}`);
      
    } catch (err) {
      console.error("❌ Failed to save min balance:", err.response?.data || err.message);
      alert("❌ Failed to save alert threshold. Please try again.");
    }
  };

  const createAccount = async () => {
    if (!accountHolderName.trim()) return;
    try {
      setLoading(true);
      await API.post(`/api/account/create/${userId}`, null, {
        params: { name: accountHolderName }
      });
      setAccountHolderName("");
      fetchUserData();
    } catch (err) {
      setError("Failed to create bank account");
      setLoading(false);
    }
  };

  const createWallet = async () => {
    try {
      setLoading(true);
      await API.post(`/api/wallet/create/${userId}`);
      fetchUserData();
    } catch (err) {
      setError("Failed to create wallet");
      setLoading(false);
    }
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  if (loading && step === "loading") {
    return <LoadingSpinner message="Setting up your dashboard..." />;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", pb: 8, px: { xs: 2, md: 0 } }}>
      {/* HEADER */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: "24px",
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
            : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[4]
        }}
      >
        <Avatar sx={{
          width: 72,
          height: 72,
          bgcolor: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: theme.shadows[8]
        }}>
          <Person fontSize="large" />
        </Avatar>
        <Box>
          <Typography 
            variant="h4" 
            fontWeight={800} 
            sx={{ 
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent",
              mb: 0.5 
            }}
          >
            Welcome back, {localStorage.getItem("username")?.toUpperCase() || "USER"}
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            Your financial command center 🚀
          </Typography>
        </Box>
      </Paper>

      {error && <ErrorAlert message={error} onRetry={fetchUserData} />}

      {/* CREATE ACCOUNT STEP */}
      {step === "create-account" && (
        <SetupCard
          title="Create Your Bank Account"
          description="Set up your primary bank account to start using the wallet."
          icon={AccountBalanceWallet}
          gradient="primary"
        >
          <CustomTextField
            label="Full Name"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && createAccount()}
            fullWidth
            sx={{ mb: 3 }}
          />
          <PrimaryButton
            fullWidth
            onClick={createAccount}
            disabled={!accountHolderName.trim() || loading}
            size="large"
          >
            {loading ? "Creating..." : "Create Bank Account"}
          </PrimaryButton>
        </SetupCard>
      )}

      {/* CREATE WALLET STEP */}
      {step === "create-wallet" && account && (
        <SetupCard
          title="Create Digital Wallet"
          description="Your wallet will be linked to your bank account for seamless transfers."
          icon={WalletIcon}
          gradient="success"
        >
          <Paper sx={{ 
            p: 4, 
            borderRadius: 3, 
            mb: 4, 
            textAlign: 'center', 
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
              Bank Account Ready ✅
            </Typography>
            <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 800 }}>
              ₹{parseFloat(account.balance || 0).toLocaleString()}
            </Typography>
          </Paper>
          <PrimaryButton
            fullWidth
            onClick={createWallet}
            size="large"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Digital Wallet"}
          </PrimaryButton>
        </SetupCard>
      )}

      {/* READY DASHBOARD */}
      {step === "ready" && account && wallet && (
        <Box>
          {/* Balance Cards */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} md={6}>
              <BalanceCard
                title="Bank Account"
                balance={parseFloat(account.balance || 0)}
                subtitle={`${account.accountHolderName} • ${account.accountNumber}`}
                icon={AccountBalanceWallet}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <BalanceCard
                title="Digital Wallet"
                balance={parseFloat(wallet.balance || 0)}
                subtitle="Ready for instant transfers"
                icon={WalletIcon}
                color="success"
              />
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, px: 1 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={6} sm={6} md={3}>
              <ActionButton
                fullWidth
                icon={Add}
                color="primary"
                onClick={() => navigate("/app/add-money")}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: '#fff',
                  py: 2,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Add Money
              </ActionButton>
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <ActionButton
                fullWidth
                icon={Send}
                color="error"
                onClick={() => navigate("/app/send-money")}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                  color: '#fff',
                  py: 2,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Send Money
              </ActionButton>
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <ActionButton
                fullWidth
                icon={History}
                variant="outlined"
                color="primary"
                onClick={() => navigate("/app/history")}
                sx={{ 
                  py: 2,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}10`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                History
              </ActionButton>
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <ActionButton
                fullWidth
                icon={AnalyticsIcon}
                variant="outlined"
                color="secondary"
                href="#charts-section"
                sx={{ 
                  py: 2,
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: `${theme.palette.secondary.main}10`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Analytics
              </ActionButton>
            </Grid>
          </Grid>

          {/* ✅ COMPLETE Min Balance Alert Section */}
          <Paper sx={{ 
            p: { xs: 3, md: 4 }, 
            borderRadius: "24px", 
            mb: 6, 
            boxShadow: 8,
            background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
          }}>
            <Typography variant="h6" sx={{ 
              mb: 3, 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              color: theme.palette.warning.main
            }}>
              🔔 Wallet Safety Alert
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 3, 
              alignItems: { sm: 'center' }, 
              mb: 2 
            }}>
              {/* ✅ FIXED Controlled TextField */}
              <TextField
                label="Minimum Balance Alert"
                type="number"
                value={minBalance !== null && minBalance !== undefined ? minBalance : ''}
                onChange={(e) => {
                  console.log("📝 Typing minBalance:", e.target.value);
                  setMinBalance(e.target.value || '');
                }}
                onBlur={saveMinBalance}
                placeholder="Enter amount (e.g. 1000)"
                fullWidth
                size="medium"
                sx={{ minWidth: { xs: '100%', sm: 220 } }}
                inputProps={{
                  step: "0.01",
                  min: "1"
                }}
                InputProps={{
                  startAdornment: (
                    <Typography sx={{ 
                      mr: 1.5, 
                      color: 'text.secondary', 
                      fontWeight: 600,
                      fontSize: '1.1rem'
                    }}>
                      ₹
                    </Typography>
                  )
                }}
              />

              {/* Save Button */}
              <Button
                variant="contained"
                size="medium"
                onClick={saveMinBalance}
                disabled={!minBalance || parseFloat(minBalance) <= 0}
                sx={{ 
                  minWidth: 180,
                  px: 4,
                  background: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
                  boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)',
                  '&:hover': {
                    background: `linear-gradient(135deg, #059669 0%, #047857 100%)`,
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px 0 rgba(16, 185, 129, 0.5)'
                  },
                  '&:disabled': {
                    background: 'rgba(16, 185, 129, 0.3)'
                  }
                }}
              >
                Save Alert
              </Button>
            </Box>

            {/* ✅ Low Balance Warning */}
            {wallet.balance && minBalance && parseFloat(wallet.balance) < parseFloat(minBalance) && (
              <Alert 
                severity="warning" 
                icon={<EmailIcon sx={{ fontSize: 24 }} />}
                sx={{ 
                  mt: 2.5, 
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  '& .MuiAlert-message': { 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }
                }}
                action={
                  <Button 
                    color="inherit" 
                    size="small"
                    onClick={() => navigate("/app/add-money")}
                  >
                    Add Money Now
                  </Button>
                }
              >
                ⚠️ Low Balance Detected! 
                Current: ₹{parseFloat(wallet.balance).toLocaleString()} 
                | Threshold: ₹{parseFloat(minBalance).toLocaleString()}
              </Alert>
            )}

            {/* Status Chip */}
            {minBalance && (
              <Chip 
                label={`Alert Active: ₹${parseFloat(minBalance).toLocaleString()}`} 
                color={wallet?.balance && parseFloat(wallet.balance) < parseFloat(minBalance) ? "warning" : "success"}
                size="small"
                variant="filled"
                sx={{ 
                  mt: 1.5, 
                  fontWeight: 600,
                  '& .MuiChip-label': { px: 2 }
                }}
              />
            )}
          </Paper>

          {/* Spending Overview */}
          <Paper sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: "32px", 
            mb: 6, 
            position: 'relative', 
            overflow: 'hidden',
            boxShadow: theme.shadows[12]
          }} id="stats-section">
            <Box sx={{
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '6px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.success.main})`
            }} />

            <Box sx={{ 
              mb: 4, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: 2 
            }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
                📊 Spending Overview
              </Typography>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Period</InputLabel>
                <Select value={period} label="Period" onChange={handlePeriodChange}>
                  <MenuItem value="day">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  borderRadius: 3, 
                  bgcolor: `${theme.palette.success.main}08`,
                  border: `1px solid ${theme.palette.success.main}20`,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <Typography variant="h4" sx={{ 
                    color: theme.palette.success.main, 
                    mb: 0.5, 
                    fontWeight: 900 
                  }}>
                    ₹{(analytics?.totalSpent || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Total Spent
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  borderRadius: 3, 
                  bgcolor: `${theme.palette.info.main}08`,
                  border: `1px solid ${theme.palette.info.main}20`,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <Typography variant="h4" sx={{ 
                    color: theme.palette.info.main, 
                    mb: 0.5, 
                    fontWeight: 900 
                  }}>
                    {analytics?.transactionCount || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Transactions
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  borderRadius: 3, 
                  bgcolor: `${theme.palette.warning.main}08`,
                  border: `1px solid ${theme.palette.warning.main}20`,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <Typography variant="h4" sx={{ 
                    color: theme.palette.warning.main, 
                    mb: 0.5, 
                    fontWeight: 900 
                  }}>
                    ₹{((analytics?.totalSpent || 0) / 7).toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Avg Daily
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  borderRadius: 3, 
                  bgcolor: `${theme.palette.error.main}08`,
                  border: `1px solid ${theme.palette.error.main}20`,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <Typography variant="h4" sx={{ 
                    color: theme.palette.error.main, 
                    mb: 0.5, 
                    fontWeight: 900,
                    textTransform: 'capitalize'
                  }}>
                    {analytics?.topCategory || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Top Category
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Charts */}
          <StandaloneCharts
            analytics={analytics}
            walletId={walletId}
            period={period}
            loading={analyticsLoading}
            onRefresh={fetchAnalytics}
          />
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
