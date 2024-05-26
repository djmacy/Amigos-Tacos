import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home.jsx';
import Login from './components/pages/Login.jsx';
import Orders from './components/pages/Orders.jsx';
import ProtectedRoute from './ProtectedRoute';

const RoutesComponent = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />}/>
                <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
            </Routes>
        </Router>
    );
};

export default RoutesComponent;