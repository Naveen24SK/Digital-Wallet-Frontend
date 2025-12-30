import React from 'react';
import { Button, Box } from '@mui/material';

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
  return (
    <Button
      fullWidth={fullWidth}
      variant={variant}
      color={color}
      className={className}
      disabled={disabled}
      onClick={onClick}
      sx={{
        height: { xs: 64, md: 72 },
        borderRadius: 3,
        fontSize: { xs: '1rem', md: '1.1rem' },
        fontWeight: 700,
        textTransform: 'none',
        boxShadow: variant === 'contained' ? 3 : 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          transition: 'left 0.5s',
        },
        '&:hover::before': {
          left: '100%',
        },
        ...props.sx
      }}
      startIcon={
        Icon && (
          <Box sx={{ 
            fontSize: { xs: 24, md: 28 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon />
          </Box>
        )
      }
      {...props}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
