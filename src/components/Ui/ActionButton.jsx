import React from 'react';
import { Button, Box, useTheme } from '@mui/material';

const ActionButton = ({
  children,
  icon: Icon,
  fullWidth,
  variant = "contained",
  color = "primary",
  className,
  disabled,
  onClick,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Button
      fullWidth={fullWidth}
      variant={variant}
      color={color}
      className={className}
      disabled={disabled}
      onClick={onClick}
      sx={{
        height: { xs: 64, md: 80 },
        borderRadius: "20px",
        fontSize: { xs: '1rem', md: '1.1rem' },
        fontWeight: 700,
        textTransform: 'none',
        flexDirection: 'column',
        gap: 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...(variant === 'outlined' && {
          borderWidth: '2px',
          '&:hover': { borderWidth: '2px' }
        }),
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        },
        ...props.sx
      }}
      {...props}
    >
      {Icon && (
        <Box sx={{
          fontSize: 28,
          mb: 0.5
        }}>
          <Icon fontSize="inherit" />
        </Box>
      )}
      {children}
    </Button>
  );
};

export default ActionButton;
