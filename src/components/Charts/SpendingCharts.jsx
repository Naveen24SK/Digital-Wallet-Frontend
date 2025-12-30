import { Grid, Typography, Paper, Box, CircularProgress, Alert, Chip } from "@mui/material";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  PieChart, Pie, Cell, Tooltip, CartesianGrid, Legend
} from "recharts";
import { TrendingUp, PieChart as PieIcon, Refresh } from "@mui/icons-material";
import API from "../../utils/api";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const SpendingCharts = ({ analytics, walletId, period, loading, onRefresh }) => {
  const fetchData = async () => {
    if (walletId && onRefresh) {
      onRefresh();
    }
  };

  if (loading) {
    return (
      <Paper id="charts-section" sx={{ p: { xs: 6, md: 8 }, borderRadius: "28px", boxShadow: 12 }}>
        <Box sx={{ textAlign: 'center', py: 12 }}>
          <CircularProgress size={60} sx={{ color: '#6366f1', mb: 4 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            Loading beautiful charts...
          </Typography>
          <Chip 
            label="🔄 Refreshing Data" 
            color="primary" 
            variant="outlined" 
            onClick={fetchData}
            clickable
          />
        </Box>
      </Paper>
    );
  }

  if (!analytics || !analytics.categories?.length) {
    return (
      <Paper id="charts-section" sx={{ p: { xs: 6, md: 8 }, borderRadius: "28px", boxShadow: 12 }}>
        <Alert severity="info" sx={{ borderRadius: 3, px: 4, py: 3 }}>
          <Typography variant="h6">No spending data yet</Typography>
          <Typography>Make some transactions to see your spending patterns</Typography>
          <Chip 
            label="🔄 Refresh" 
            onClick={fetchData}
            color="primary" 
            sx={{ mt: 2 }}
            clickable
          />
        </Alert>
      </Paper>
    );
  }

  const categoryData = analytics.categories.map((c, i) => ({
    name: c.category.toUpperCase(),
    value: Number(c.amount),
    fill: COLORS[i % COLORS.length],
  }));

  const periodData = analytics.periodData.slice(0, 7).map(p => ({
    name: p.date.slice(5, 10), // MM-DD format
    amount: Number(p.amount),
  }));

  return (
    <Paper id="charts-section" sx={{ p: { xs: 6, md: 8 }, borderRadius: "28px", boxShadow: 16 }}>
      {/* Charts Header */}
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          {/* <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            📊
          </Typography> */}
          <Typography variant="h3" sx={{ fontWeight: 900 }}>
            📊 Spending Analytics Charts
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Visualize your spending patterns for {period.toUpperCase()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip label={`₹${(analytics.totalSpent || 0).toLocaleString()}`} color="primary" size="medium" />
          <Chip label={`${analytics.transactionCount || 0} Txns`} color="secondary" variant="outlined" size="medium" />
          <Chip 
            icon={<Refresh />} 
            label="Refresh Charts" 
            onClick={fetchData}
            color="primary" 
            variant="outlined"
            clickable
            sx={{ px: 3 }}
          />
        </Box>
      </Box>

      {/* Charts Grid */}
      <Grid container spacing={6}>
        {/* PIE CHART - Category Breakdown */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 6, height: 520, borderRadius: "20px", background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, fontWeight: 700 }}>
                <PieIcon color="primary" sx={{ fontSize: 32 }} />
                Spending by Category
              </Typography>
              <Typography variant="body1" color="text.secondary">
                See where your money is going
              </Typography>
            </Box>
            
            <ResponsiveContainer width="100%" height={380}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={60}
                  dataKey="value"
                  nameKey="name"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle"
                  wrapperStyle={{ paddingLeft: 20 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* BAR CHART - Daily/Weekly Trend */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 6, height: 520, borderRadius: "20px", background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, fontWeight: 700 }}>
                <TrendingUp color="success" sx={{ fontSize: 32 }} />
                Spending Trend
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track your spending over time
              </Typography>
            </Box>
            
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={periodData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  height={80}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="amount" 
                  fill="#6366f1" 
                  radius={[8, 8, 0, 0]}
                  background={{ fill: '#f1f5f9' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Categories Preview */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>
          🎯 Top Spending Categories
        </Typography>
        <Paper sx={{ p: 4, borderRadius: "20px", background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
          <Grid container spacing={3}>
            {categoryData.slice(0, 4).map((cat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: `${COLORS[index % COLORS.length]}10`,
                  border: `2px solid ${COLORS[index % COLORS.length]}30`,
                  textAlign: 'center',
                  '&:hover': { transform: 'translateY(-4px)', transition: '0.3s' }
                }}>
                  <Typography variant="h6" sx={{ color: COLORS[index % COLORS.length], fontWeight: 700, mb: 1 }}>
                    {cat.name}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS[index % COLORS.length] }}>
                    ₹{cat.value.toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Paper>
  );
};

export default SpendingCharts;
