import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import AddMoney from "./Pages/AddMoney/AddMoney";
import SendMoney from "./Pages/SendMoney/SendMoney";
// import History from "./Pages/History/History";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/app" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-money" element={<AddMoney />} />
          <Route path="send-money" element={<SendMoney />} />
          {/* <Route path="history" element={<History />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
