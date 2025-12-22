import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = ({ message = "Loading...", size = 60 }) => (
  <Box sx={{ 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center", 
    minHeight: "60vh", 
    gap: 3 
  }}>
    <CircularProgress size={size} thickness={4} sx={{ color: "#667eea" }} />
    <Typography variant="h6" sx={{ color: "#667eea", fontWeight: 600 }}>
      {message}
    </Typography>
  </Box>
);

export default LoadingSpinner;
