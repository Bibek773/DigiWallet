import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import "./CollegeLayout.css";

export default function CollegeLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="college-layout">
            <button
                type="button"
                className={`college-sidebar-backdrop ${isSidebarOpen ? "is-visible" : ""}`}
                onClick={closeSidebar}
                aria-label="Close sidebar navigation"
            />

            <Sidebar
                className={`college-sidebar ${isSidebarOpen ? "college-sidebar--open" : ""}`}
                onNavigate={closeSidebar}
            />

            <main className="college-layout-content">
                <TopNavbar
                    onProfileClick={() => setIsSidebarOpen((open) => !open)}
                    isSidebarOpen={isSidebarOpen}
                />
                <Outlet />
            </main>
        </div>
    );
}
