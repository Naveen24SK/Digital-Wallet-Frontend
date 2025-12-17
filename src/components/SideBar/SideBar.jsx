import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import LogoutIcon from "@mui/icons-material/Logout";
import "./sidebar.css";

const Sidebar = ({ open }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className={open ? "sidebar open" : "sidebar"}>
      <ul>
        <li onClick={() => navigate("/app/dashboard")}>
          <HomeIcon /> Dashboard
        </li>

        <li onClick={() => navigate("/app/history")}>
          <HistoryIcon /> History
        </li>

        <li onClick={() => navigate("/app/add-money")}>
          <AddIcon /> Add Money
        </li>

        <li onClick={() => navigate("/app/send-money")}>
          <SendIcon /> Send Money
        </li>
      </ul>

      <div className="logout" onClick={logout}>
        <LogoutIcon /> Logout
      </div>
    </div>
  );
};

export default Sidebar;
