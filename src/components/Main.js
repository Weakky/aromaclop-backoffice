import React from 'react';

const Main = ( props ) => (
    <div style={{
        flex: 1,
        height: '100vh',
        overflow: 'auto',
        backgroundColor: '#FFF',
    }}>
        <div style={{ padding: 20 }}{...props} />
    </div>
);

export default Main;