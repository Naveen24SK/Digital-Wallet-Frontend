import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination,
  Chip, IconButton, TextField, InputAdornment,
  Select, MenuItem, FormControl, InputLabel, Button,
  Alert, Grid, useTheme, Tooltip
} from "@mui/material";
import {
  Search, Refresh, ArrowBack,
  CheckCircle, Cancel, TrendingUp, TrendingDown, FilterList
} from "@mui/icons-material";
import API from "../../utils/api";
import LoadingSpinner from "../../components/Ui/LoadingSpinner";
import PrimaryButton from "../../components/Ui/PrimaryButton";
import CustomTextField from "../../components/Ui/CustomTextField";

const History = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const walletId = localStorage.getItem("walletId");

  // Table State
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    category: "",
    search: "",
    dateFrom: "",
    dateTo: ""
  });

  const fetchTransactions = async () => {
    if (!walletId) return;
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: rowsPerPage.toString(),
        ...filters
      });

      const response = await API.get(`/api/wallet/history/${walletId}?${params}`);
      setTransactions(response.data.content || []);
      setTotalCount(response.data.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError("Failed to load transaction history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    setPage(0);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      status: "",
      category: "",
      search: "",
      dateFrom: "",
      dateTo: ""
    });
    setPage(0);
  };

  const getStatusChip = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return <Chip label="SUCCESS" color="success" size="small" variant="outlined" icon={<CheckCircle />} />;
      case "FAILED":
        return <Chip label="FAILED" color="error" size="small" variant="outlined" icon={<Cancel />} />;
      case "PENDING":
        return <Chip label="PENDING" color="warning" size="small" variant="outlined" />;
      default:
        return <Chip label={status} size="small" variant="outlined" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "SEND_MONEY":
        return <TrendingUp fontSize="small" sx={{ color: theme.palette.error.main }} />;
      case "ADD_MONEY":
        return <TrendingDown fontSize="small" sx={{ color: theme.palette.success.main }} />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 2
    }).format(amount);
  };

  if (loading && transactions.length === 0) {
    return <LoadingSpinner message="Loading transaction history..." />;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: "32px",
          mb: 4,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[4]
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <PrimaryButton
            onClick={() => navigate(-1)}
            variant="text"
            sx={{ p: 1, minWidth: "auto", borderRadius: '50%', color: theme.palette.text.secondary }}
          >
            <ArrowBack />
          </PrimaryButton>
          <Typography variant="h4" sx={{ fontWeight: 800, flexGrow: 1 }}>
            Transaction History
          </Typography>
          <Chip
            label={`${totalCount} transactions`}
            color="primary"
            variant="filled"
            sx={{ borderRadius: '12px', fontWeight: 700 }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: "24px", mb: 4, bgcolor: theme.palette.action.hover }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FilterList color="action" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Filters</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomTextField
                label="Search Tx ID"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                sx={{ bgcolor: theme.palette.background.paper }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  label="Type"
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  sx={{ borderRadius: '12px', bgcolor: theme.palette.background.paper }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="SEND_MONEY">Send Money</MenuItem>
                  <MenuItem value="ADD_MONEY">Add Money</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  sx={{ borderRadius: '12px', bgcolor: theme.palette.background.paper }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="SUCCESS">Success</MenuItem>
                  <MenuItem value="FAILED">Failed</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={fetchTransactions}
                  sx={{ borderRadius: '12px', textTransform: 'none', flex: 1 }}
                >
                  Apply
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={clearFilters}
                  sx={{ borderRadius: '12px', textTransform: 'none', flex: 1 }}
                >
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Table */}
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "24px", border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {['Date', 'Tx ID', 'Type', 'Amount', 'From', 'To', 'Category', 'Status', 'Purpose'].map((head) => (
                  <TableCell key={head} sx={{
                    bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b',
                    fontWeight: 700,
                    color: theme.palette.text.secondary
                  }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow
                  key={tx.id || tx.transactionId}
                  hover
                  sx={{
                    '&:hover': { backgroundColor: theme.palette.action.hover },
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {formatDate(tx.createdAt).split(',')[0]}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={tx.transactionId}>
                      <Typography variant="body2" sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'monospace' }}>
                        {tx.transactionId}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getTypeIcon(tx.transactionType)}
                      <Typography variant="body2" fontWeight={600} color={tx.transactionType === 'ADD_MONEY' ? 'success.main' : 'error.main'}>
                        {tx.transactionType === 'ADD_MONEY' ? 'In' : 'Out'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight={700} color={tx.transactionType === 'SEND_MONEY' ? 'error.main' : 'success.main'}>
                      {formatAmount(tx.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tx.senderWalletId || tx.senderAccountId || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tx.receiverWalletId || tx.receiverAccountId || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={tx.category || 'OTHERS'} size="small" sx={{ borderRadius: '8px', bgcolor: theme.palette.action.selected }} />
                  </TableCell>
                  <TableCell>
                    {getStatusChip(tx.status)}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 150 }}>
                    <Typography variant="body2" noWrap color="text.secondary">
                      {tx.purpose || '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
        />
      </Paper>
    </Box>
  );
};

export default History;
