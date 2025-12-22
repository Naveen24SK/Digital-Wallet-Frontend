import { Alert, Button } from "@mui/material";

const ErrorAlert = ({ message, onRetry, sx }) => (
  <Alert 
    severity="error" 
    sx={{ 
      mb: 3, 
      borderRadius: "12px",
      fontWeight: 500,
      ...sx 
    }}
  >
    {message}
    {onRetry && (
      <Button 
        size="small" 
        onClick={onRetry} 
        sx={{ ml: 2, textTransform: "none" }}
      >
        Retry
      </Button>
    )}
  </Alert>
);

export default ErrorAlert;
