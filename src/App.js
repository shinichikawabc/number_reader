import React from 'react';
import DrawingCanvas from './DrawingCanvas';

function App() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
            <DrawingCanvas />
        </div>
    );
}

export default App;