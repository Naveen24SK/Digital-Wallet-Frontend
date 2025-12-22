import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Container, 
  Alert,
  Link,
  CircularProgress
} from "@mui/material";
import { PersonAdd as RegisterIcon } from "@mui/icons-material";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
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
      await API.post("/auth/register", form);
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
    <Container maxWidth="sm">
      <Box className="register-container">
        <Paper elevation={6} className="register-card">
          <Box className="register-header">
            <RegisterIcon className="register-icon" />
            <Typography variant="h4" className="register-title">
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join our wallet platform today
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box className="register-form">
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              fullWidth
              margin="normal"
              variant="outlined"
              disabled={loading}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              fullWidth
              margin="normal"
              variant="outlined"
              disabled={loading}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              fullWidth
              margin="normal"
              variant="outlined"
              disabled={loading}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleRegister}
              disabled={loading}
              className="register-btn"
              sx={{ mt: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : "Create Account"}
            </Button>
            <Box className="register-footer">
              <Typography variant="body2">
                Already have an account?{" "}
                <Link href="/" underline="hover" className="login-link">
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
