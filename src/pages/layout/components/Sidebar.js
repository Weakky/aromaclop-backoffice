import React from "react";
import { GoDatabase } from "react-icons/lib/go";

import "../styles/sidebar.css";

const Sidebar = props => (
  <div className="Sidebar-container">
    <div className="Sidebar-header">
      <GoDatabase size={24} className="Sidebar-icon" />
      <span className="Sidebar-title">Aromaclop</span>
    </div>
    <div className="Sidebar-nav" {...props} />
  </div>
);

export default Sidebar;
