import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/SideBar/SideBar";
import Topbar from "./components/TopBar/TopBar";
import "./App.css";

const AppLayout = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="layout">
    <div className="layout-root">
      <Topbar toggleSidebar={() => setOpen(!open)} />
      <div className="layout-body">
        <Sidebar open={open} />
        <div className="layout-content">
          <Outlet />
        </div>
      </div>
    </div>
    </div>
  );
};

export default AppLayout;
