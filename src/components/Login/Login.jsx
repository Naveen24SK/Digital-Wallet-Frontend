import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Typography, Box, Alert, Link, Paper, useTheme } from "@mui/material";
import { Login as LoginIcon, AccountBalanceWallet } from "@mui/icons-material";
import API from "../../utils/api";
import CustomTextField from "../../components/Ui/CustomTextField";
import PrimaryButton from "../../components/Ui/PrimaryButton";

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("token", res.data.token);
      navigate("/app/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.palette.mode === 'light'
        ? 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)'
        : 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
    }}>
      <Container maxWidth="xs">
        <Paper
          elevation={24}
          sx={{
            p: 5,
            paddingTop: 7,
            borderRadius: 5,
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            backdropFilter: 'blur(20px)',
            backgroundColor: theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.75)'
              : 'rgba(30, 41, 59, 0.75)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Decorative Circle */}
          <Box sx={{
            position: 'absolute',
            top: -50,
            left: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            opacity: 0.5,
            filter: 'blur(40px)',
          }} />

          <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
            <Box sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: '50%',
              bgcolor: theme.palette.primary.main + '20',
              mb: 2
            }}>
              <AccountBalanceWallet sx={{ fontSize: 40, color: theme.palette.primary.main }} />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 1, letterSpacing: '-0.5px' }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to manage your wallet
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          <CustomTextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            autoComplete="username"
            sx={{ mb: 3 }}
          />

          <CustomTextField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            autoComplete="current-password"
            sx={{ mb: 4 }}
          />

          <PrimaryButton
            fullWidth
            onClick={handleLogin}
            loading={loading}
            disabled={loading}
            startIcon={<LoginIcon />}
            sx={{ mb: 3 }}
          >
            Sign In
          </PrimaryButton>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                underline="none"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                Create Account
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
