import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Typography, Avatar, Paper} from "@mui/material";
import { AccountBalanceWallet, Wallet as WalletIcon, Add, Send, History, Person, TrendingUp} from "@mui/icons-material";
import API from "../../utils/api";

// UI Components
import SetupCard from "../../components/Ui/SetupCard";
import PrimaryButton from "../../components/Ui/PrimaryButton";
import CustomTextField from "../../components/Ui/CustomTextField";
import BalanceCard from "../../components/Ui/BalanceCard";
import ActionButton from "../../components/Ui/ActionButton";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import ErrorAlert from "../../components/Ui/ErrorAlert";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  // TEMP (later JWT)
  const userId = localStorage.getItem("userId");

  const [step, setStep] = useState("loading");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [account, setAccount] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  

  // ----------------------------------
  // FETCH ACCOUNT & WALLET
  // ----------------------------------
const fetchUserData = async () => {
  try {
    const userId = localStorage.getItem("userId");
    console.log("🔍 Dashboard - userId:", userId);

    // ---- ACCOUNT CHECK ----
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

    // ---- WALLET CHECK ----
    try {
      const walletRes = await API.get(`/wallet/by-user/${userId}`);
      setWallet(walletRes.data);
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
  } finally {
    setLoading(false);
  }
};


  // ----------------------------------
  // CREATE ACCOUNT
  // ----------------------------------
  const createAccount = async () => {
    if (!accountHolderName.trim()) return;

    try {
      setLoading(true);
      await API.post(`/account/create/${userId}`, null, {
        params: { name: accountHolderName }
      });
      setAccountHolderName("");
      fetchUserData();
    } catch {
      setError("Failed to create bank account");
      setLoading(false);
    }
  };

  // ----------------------------------
  // CREATE WALLET
  // ----------------------------------
  const createWallet = async () => {
    try {
      setLoading(true);
      await API.post(`/wallet/create/${userId}`);
      fetchUserData();
    } catch {
      setError("Failed to create wallet");
      setLoading(false);
    }
  };

  // ----------------------------------
  // LOADING STATE
  // ----------------------------------
  if (loading && step === "loading") {
    return <LoadingSpinner message="Setting up your dashboard..." />;
  }

  return (
    <Box sx={{ background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)"  }}>
      <Box sx={{ maxWidth: "1400px", mx: "auto", p: 2, height: "87vh" }}>

        {/* HEADER */}
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          background: "white",
          p: 2,
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar sx={{ width: 56, height: 56, background: "linear-gradient(135deg,#667eea,#764ba2)" }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Welcome back, {localStorage.getItem("username")?.toUpperCase() || "USER"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Manage your finances with ease
              </Typography>
            </Box>
          </Box>
        </Box>

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
              label="Account Holder Name"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && createAccount()}
            />
            <PrimaryButton
              onClick={createAccount}
              disabled={!accountHolderName.trim() || loading}
              sx={{ mt: 3 }}
            >
              Create Bank Account
            </PrimaryButton>
          </SetupCard>
        )}

        {/* STEP 2: CREATE WALLET */}
        {step === "create-wallet" && account && (
          <SetupCard
            title="Create Wallet"
            description="Create your digital wallet to start transactions."
            icon={WalletIcon}
            gradient="success"
          >
            <Typography sx={{ mb: 2 }}>
              Bank Account Balance: ₹ {account.balance}
            </Typography>
            <PrimaryButton onClick={createWallet}>
              Create Wallet
            </PrimaryButton>
          </SetupCard>
        )}

        {/* STEP 3: READY DASHBOARD */}
        {step === "ready" && account && wallet && (
          <>
            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <BalanceCard
                  title="Bank Account"
                  balance={account.balance}
                  subtitle={`${account.accountHolderName} • ${account.accountNumber}`}
                  icon={AccountBalanceWallet}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <BalanceCard
                  title="Wallet"
                  balance={wallet.balance}
                  subtitle="Available for instant transfers"
                  icon={WalletIcon}
                  color="success"
                />
              </Grid>
            </Grid>

            <Paper sx={{ p: 5, borderRadius: "24px", boxShadow: "0 15px 50px rgba(0,0,0,0.08)" }}>
              <Typography variant="h6" sx={{ mb: 4 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <ActionButton fullWidth icon={Add} onClick={() => navigate("/app/add-money")}>
                    Add Money
                  </ActionButton>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ActionButton fullWidth icon={Send} color="error" onClick={() => navigate("/app/send-money")}>
                    Send Money
                  </ActionButton>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ActionButton fullWidth icon={History} variant="outlined" onClick={() => navigate("/app/history")}>
                    History
                  </ActionButton>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ActionButton fullWidth icon={TrendingUp} variant="outlined" onClick={fetchUserData}>
                    Refresh
                  </ActionButton>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
