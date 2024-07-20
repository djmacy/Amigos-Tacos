import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import RoutesComponent from "./Routes";
import Footer from "./components/Footer";
import './App.css';

const App = () => {
    useEffect(() => {
        const timer = setTimeout(() => {
            document.getElementById('overlay').classList.add('move-up');
        }, 1000); // Adjust the time (1000ms = 1 second) as needed
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div id="overlay">
                <div className="logo-container">
                    <img src="./images/newAmigosTacosLogo.png" alt="Logo" />
                    <h1>Amigos Tacos</h1>
                </div>
            </div>
            { /*<Navbar />*/}
            <RoutesComponent />
            <Footer />
        </>
    );
};

export default App;
