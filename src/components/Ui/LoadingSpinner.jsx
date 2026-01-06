import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

const LoadingSpinner = ({ message = "Loading...", size = 60 }) => {
  const theme = useTheme();

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      gap: 3
    }}>
      <CircularProgress size={size} thickness={4} sx={{ color: theme.palette.primary.main }} />
      <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
