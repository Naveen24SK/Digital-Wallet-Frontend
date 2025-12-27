import { FormControl, InputLabel, Select, MenuItem, Box, Chip } from "@mui/material";

const categories = [
  { value: "food", label: "Food", color: "error" },
  { value: "shopping", label: "Shopping", color: "primary" },
  { value: "clothes", label: "Clothes", color: "secondary" },
  { value: "finance", label: "Finance", color: "warning" },
  { value: "groceries", label: "Groceries", color: "success" },
  { value: "others", label: "Others", color: "default" }
];

const TransactionCategorySelect = ({ value, onChange, label = "Category", fullWidth }) => (
  <FormControl fullWidth={fullWidth} size="small" sx={{ mt: 2 }}>
    <InputLabel>{label}</InputLabel>
    <Select value={value} label={label} onChange={onChange}>
      {categories.map((cat) => (
        <MenuItem key={cat.value} value={cat.value}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip label={cat.label} size="small" color={cat.color} />
          </Box>
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default TransactionCategorySelect;
