import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Typography, Box, Alert, Link } from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import API from "../../utils/api";

import CustomTextField from "../../components/Ui/CustomTextField";
import PrimaryButton from "../../components/Ui/PrimaryButton";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

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

      // ✅ CORRECT STORAGE
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("token", res.data.token);

      console.log("✅ Login Success:", res.data);

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
    <Container maxWidth="sm">
      <Box className="login-container">
        <Box className="login-card">
          <LoginIcon sx={{ fontSize: 64, mb: 2 }} />
          
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Welcome Digi Wallet
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 4 }}>
            Sign in to your wallet account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
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
            sx={{ mb: 3 }}
          />

          <PrimaryButton
            fullWidth
            onClick={handleLogin}
            loading={loading}
            disabled={loading}
            sx={{ mb: 3 }}
          >
            Sign In
          </PrimaryButton>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link component={RouterLink} to="/register" underline="hover">
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
