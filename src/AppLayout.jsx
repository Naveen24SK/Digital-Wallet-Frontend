import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/SideBar/SideBar";
import Topbar from "./components/TopBar/TopBar";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
    // ✅ REDIRECT if not logged in
    if (!userId || !token) {
      navigate("/");
    }
  }, [navigate]);


  return (
    <div className="layout">
    <div className="layout-root">
      <Topbar toggleSidebar={() => setOpen(!open)} />
      <div className="layout-body">
        <Sidebar open={open} />
        <div className="layout-mask">
        <div className="layout-content">
          <Outlet />
                    </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AppLayout;
