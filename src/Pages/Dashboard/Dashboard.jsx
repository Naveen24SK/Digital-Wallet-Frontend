import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Grid, Box, Typography, Avatar, Paper, Tabs, Tab, 
  Select, MenuItem, FormControl, InputLabel 
} from "@mui/material";
import { 
  AccountBalanceWallet, Wallet as WalletIcon, Add, Send, History, 
  Person, TrendingUp, BarChart as AnalyticsIcon, FilterList
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
import StandaloneCharts from "../../components/Charts/SpendingCharts"; // ✅ NEW SEPARATE SECTION

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const walletId = localStorage.getItem("walletId");

  const [step, setStep] = useState("loading");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [account, setAccount] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState("week");
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState("");

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
      console.log("🔍 Dashboard - userId:", userId);

      try {
        const accRes = await API.get(`/account/by-user/${userId}`);
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
        const walletRes = await API.get(`/wallet/by-user/${userId}`);
        setWallet(walletRes.data);
        localStorage.setItem("walletId", walletRes.data.id.toString());
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
      console.error("Dashboard load failed", err);
      setError("Failed to load dashboard");
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!walletId) return;
    setAnalyticsLoading(true);
    try {
      const res = await API.get(`/wallet/analytics/${walletId}?period=${period}`);
      setAnalytics(res.data);
    } catch (err) {
      console.error("Analytics fetch failed:", err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const createAccount = async () => {
    if (!accountHolderName.trim()) return;
    try {
      setLoading(true);
      await API.post(`/account/create/${userId}`, null, {
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
      await API.post(`/wallet/create/${userId}`);
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
    <Box className="dashboard-root">
      <Box className="dashboard-container">
        {/* HEADER */}
        <Paper className="dashboard-header" elevation={4}>
          <Box className="user-info">
            <Avatar className="user-avatar">
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h5" className="welcome-text">
                Welcome back, {localStorage.getItem("username")?.toUpperCase() || "USER"}
              </Typography>
              <Typography variant="body2" className="subtitle">
                Complete financial overview ✨
              </Typography>
            </Box>
          </Box>
        </Paper>

        {error && <ErrorAlert message={error} onRetry={fetchUserData} />}

        {/* STEP 1: CREATE ACCOUNT */}
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

        {/* STEP 2: CREATE WALLET */}
        {step === "create-wallet" && account && (
          <SetupCard
            title="Create Digital Wallet"
            description="Your wallet will be linked to your bank account for seamless transfers."
            icon={WalletIcon}
            gradient="success"
          >
            <Paper sx={{ p: 4, borderRadius: 2, mb: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Bank Account Ready ✅
              </Typography>
              <Typography variant="body1" sx={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 700 }}>
                Balance: ₹{parseFloat(account.balance || 0).toLocaleString()}
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

        {/* STEP 3: READY DASHBOARD */}
        {step === "ready" && account && wallet && (
          <Box>
            {/* Balance Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <BalanceCard
                  title="Bank Account"
                  balance={parseFloat(account.balance || 0)}
                  subtitle={`${account.accountHolderName} • ****${account.accountNumber?.slice(-4)}`}
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
            <Paper sx={{ p: { xs: 4, md: 5 }, borderRadius: "24px", mb: 4, boxShadow: 8 }}>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, textAlign: 'center' }}>
                Quick Actions
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <ActionButton fullWidth icon={Add} color="primary" onClick={() => navigate("/app/add-money")}>
                    Add Money
                  </ActionButton>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ActionButton fullWidth icon={Send} color="error" onClick={() => navigate("/app/send-money")}>
                    Send Money
                  </ActionButton>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ActionButton fullWidth icon={History} variant="outlined" color="primary" onClick={() => navigate("/app/history")}>
                    Full History
                  </ActionButton>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ActionButton fullWidth icon={AnalyticsIcon} variant="outlined" color="secondary" href="#charts-section">
                    📊 View Charts
                  </ActionButton>
                </Grid>
              </Grid>
            </Paper>

            {/* ✅ OVERVIEW STATS */}
            <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: "24px", mb: 4, boxShadow: 8 }} id="stats-section">
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  📈 Spending Overview
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
                  <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="h3" sx={{ color: '#10b981', mb: 1, fontWeight: 900 }}>
                      ₹{(analytics?.totalSpent || 0).toLocaleString()}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">Total Spent</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="h3" sx={{ color: '#3b82f6', mb: 1, fontWeight: 900 }}>
                      {analytics?.transactionCount || 0}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">Transactions</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="h3" sx={{ color: '#f59e0b', mb: 1, fontWeight: 900 }}>
                      ₹{((analytics?.totalSpent || 0) / 7).toFixed(0)}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">Avg Daily</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 4, textAlign: 'center',  borderRadius: 3 }}>
                    <Typography variant="h3" sx={{ color: '#ef4444', mb: 1, fontWeight: 900 }}>
                      {analytics?.topCategory || 'N/A'}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">Top Category</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>

            {/* ✅ STANDALONE CHARTS SECTION */}
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
    </Box>
  );
};

export default Dashboard;
