import MenuIcon from "@mui/icons-material/Menu";
import "../TopBar/TopBar.css";

const Topbar = ({ toggleSidebar }) => {
  return (
    <div className="topbar">
      <MenuIcon onClick={toggleSidebar} />
      <h3>Wallet App</h3>
    </div>
  );
};

export default Topbar;
