import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
// import History from "./pages/History";
// import AddMoney from "./pages/AddMoney";
// import SendMoney from "./pages/SendMoney";
import LoginPage from "./pages/LoginPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login page (no layout) */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected layout */}
        <Route path="/app" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          {/* <Route path="history" element={<History />} />
          <Route path="add-money" element={<AddMoney />} />
          <Route path="send-money" element={<SendMoney />} /> */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
