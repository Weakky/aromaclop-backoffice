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
    <div className="Sidebar-status">
      <a target="_blank" href="https://status.graph.cool/">
        <img
          src={require("../../../assets/img/graphcool.png")}
          className="Sidebar-status-img"
        />
      </a>
      <span className="Sidebar-status-label">Status des services</span>
    </div>
  </div>
);

export default Sidebar;
