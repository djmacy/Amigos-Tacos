import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home.jsx';
import Login from './components/pages/Login.jsx';
import Orders from './components/pages/Orders.jsx';
import ThankYou from './components/pages/ThankYou.jsx'
import ProtectedRoute from './ProtectedRoute';
import TermsOfService from "./components/pages/TermsOfService.jsx";
import PrivacyPolicy from "./components/pages/PrivacyPolicy.jsx";

const RoutesComponent = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />}/>
                <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
                <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
        </Router>
    );
};

export default RoutesComponent;