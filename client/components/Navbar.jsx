import React, {useEffect, useState} from 'react';
import './Navbar.css';
import Logo from './Logo';

const Navbar = () => {

    const [burger_class, setBurgerClass] = useState("burger-bar unclicked")
    const [menu_class, setMenuClass] = useState("menu")
    const [isMenuClicked, setIsMenuClicked] = useState(false)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Initialize with current window width

    // Function to handle window resize
    const handleResize = () => {
        setWindowWidth(window.innerWidth); // Update window width state

    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Update menu visibility based on window width
    useEffect(() => {
        if (windowWidth > 768) {
            setMenuClass("menu hidden");
        }
    }, [windowWidth]);

    const updateMenu = () => {
        if (!isMenuClicked) {
            setBurgerClass("burger-bar clicked")
            setMenuClass("menu visible")
        } else {
            setBurgerClass("burger-bar unclicked")
            setMenuClass("menu hidden")
        }
        setIsMenuClicked(!isMenuClicked);
    }
    return (
        <nav>
            <Logo below={true}/>
            <ul className="navbar-link">
                {/*<li><a href="/">Home</a></li>*/}
            </ul>
        </nav>
    );
    { /*
    if (window.innerWidth > 850) {
        return (
            <nav>
                <Logo below={true}/>
                <ul className="navbar-link">
                    {/*<li><a href="/">Home</a></li>
                </ul>
            </nav>
 /*);
    } else {
        return (
            <div>
                <nav>
                    <Logo below={true}/>
                    <div className="burger-menu" onClick={updateMenu}>
                        <div className={burger_class} ></div>
                        <div className={burger_class} ></div>
                        <div className={burger_class} ></div>
                    </div>

                </nav>
                <div className={menu_class}>
                    <ul>
                        <li><a href="/">Home</a></li>
                    </ul>
                </div>
            </div>
        )
    }*/}
};

export default Navbar;