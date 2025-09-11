import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
    return (
        <div className="layout">
            
            <Navbar />
            <div className="layout-body">
                <Sidebar />
                <main className="content">
                    {children}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
