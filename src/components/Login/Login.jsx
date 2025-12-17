import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { TextField, Button, Typography, Box } from "@mui/material";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();   

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);

      // OPTIONAL: store user info
      localStorage.setItem("username", res.data.username);

      navigate("/app/dashboard");   // ✅ IMPORTANT
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <Box className="login-container">
      <Typography variant="h5">Login</Typography>

      <TextField
        label="Username"
        name="username"
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Password"
        type="password"
        name="password"
        onChange={handleChange}
        fullWidth
      />

      <Button variant="contained" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
};

export default Login;
