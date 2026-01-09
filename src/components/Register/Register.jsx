import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Typography, Box, Alert, Link, Paper, useTheme } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import API from "../../utils/api";
import CustomTextField from "../../components/Ui/CustomTextField";
import PrimaryButton from "../../components/Ui/PrimaryButton";

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await API.post("/api/auth/register", form);
      alert("Registered successfully! Please login.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleRegister();
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
            paddingTop: 6,
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
            right: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
            opacity: 0.5,
            filter: 'blur(40px)',
          }} />

          <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
            <Box sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: '50%',
              bgcolor: theme.palette.secondary.main + '20',
              mb: 2
            }}>
              <PersonAdd sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 1, letterSpacing: '-0.5px' }}>
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join the future of banking
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
            sx={{ mb: 2 }}
          />

          <CustomTextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            sx={{ mb: 2 }}
          />

          <CustomTextField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            sx={{ mb: 3 }}
          />

          <PrimaryButton
            fullWidth
            onClick={handleRegister}
            loading={loading}
            disabled={loading}
            startIcon={<PersonAdd />}
            sx={{ mb: 3, background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`, boxShadow: `0 8px 20px -4px ${theme.palette.secondary.main}80` }}
          >
            Sign Up
          </PrimaryButton>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/"
                underline="none"
                sx={{ fontWeight: 700, color: theme.palette.secondary.main }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
