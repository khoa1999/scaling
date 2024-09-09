import * as React from 'react';
import { Outlet } from 'react-router-dom'

export default function Layout() {
    return (
        <><div className="sidebar">
            <div className="sidebar-content">
                <a href="/" className="sidebar-link">
                    <i className="fas fa-home"></i>
                    <span>Home</span>
                </a>
                <a href="/cable_calculate" className="sidebar-link">
                    <i className="fas fa-calculator"></i>
                    <span>Cables Calculator</span>
                </a>
                <a href="/cable_tray" className="sidebar-link">
                    <i className="fas fa-box-open"></i>
                    <span>Cable Tray</span>
                </a>
                <a href="/conduit" className="sidebar-link">
                    <i className="far fa-clock"></i>
                    <span>Conduits</span>
                </a>
                <a href="/support" className="sidebar-link">
                    <i className="fas fa-tools"></i>
                    <span>Support - Steel</span>
                </a>
            </div>
        </div>
        <div className="main-content">
            <Outlet />
        </div>
        </>
    );
}