import { FormControl, InputLabel, Select, MenuItem, Chip, Box } from "@mui/material";

const categories = [
  { value: "food", label: "🍔 Food", color: "error" },
  { value: "shopping", label: "🛒 Shopping", color: "primary" },
  { value: "clothes", label: "👗 Clothes", color: "secondary" },
  { value: "finance", label: "💰 Finance", color: "warning" },
  { value: "groceries", label: "🥛 Groceries", color: "success" },
  { value: "others", label: "📦 Others", color: "default" }
];

const CategorySelect = ({ value, onChange, label = "Purpose of Payment" }) => (
  <FormControl fullWidth margin="normal">
    <InputLabel>{label}</InputLabel>
    <Select value={value || "others"} label={label} onChange={onChange}>
      {categories.map((cat) => (
        <MenuItem key={cat.value} value={cat.value}>
          <Chip 
            label={cat.label} 
            size="small" 
            color={cat.color}
            sx={{ height: 28, mr: 1 }}
          />
          {cat.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default CategorySelect;
