import { useState } from "react";
import API from "../../utils/api";
import { TextField, Button, Typography, Box } from "@mui/material";
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <Box className="register-container">
      <Typography variant="h5">Register</Typography>

      <TextField
        label="Username"
        name="username"
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Email"
        name="email"
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

      <Button variant="contained" onClick={handleRegister}>
        Register
      </Button>
    </Box>
  );
};

export default Register;
