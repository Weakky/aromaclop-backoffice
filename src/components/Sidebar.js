import React from 'react';
import './styles/sidebar.css';

const Sidebar = ( props ) => (
    <div className="Sidebar-container">
        <div className='Sidebar-nav' {...props} />    
    </div>
);

export default Sidebar;