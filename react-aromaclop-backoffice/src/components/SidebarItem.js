import React from 'react';

const SidebarItem = ( props ) => (
    <div 
    style={{
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        padding: '5px 10px',
    }} {...props} />
)

export default SidebarItem;