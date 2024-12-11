import './Logo.css'
import logoImage from '../images/newAmigosTacosLogo.png';

const Logo = ({below}) => {

    if (below) {
        return (
            <div className="logo-below">
                <img src={logoImage} alt="Logo"/>
                <h2 className="h2-below">Amigos Tacos</h2>

            </div>
        );
    } else {
        return (
            <div className="logo">
                <a href="/">
                    <img src={logoImage} alt="Logo"/>
                </a>
                <h2 className="h2-right">Amigos Tacos</h2>
            </div>
        );
    }
};

export default Logo;