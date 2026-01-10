import React from 'react'
import { createRoot } from 'react-dom/client'
import App from '../../App'
import '/src/styles.css';
import AuthProvider from '../../contexts/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
