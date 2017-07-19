import React from 'react';

const Sidebar = ( props ) => (
    <div style={{
        width: '15vw',
        height: '100vh',
        overflow: 'auto',
        background: '#0f202e',
    }}>
        <div style={{
            width: '15vw',
            height: '8vh',
            overflow: 'auto',
            background: '#172a3a',
        }}>
        </div>
        <div className='Sidebar-nav' style={{
            padding: '10px',
        }} {...props} />    
    </div>
        
    
);

export default Sidebar;