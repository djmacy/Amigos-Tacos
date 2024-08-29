import { useLocation } from 'react-router-dom';
import "./ThankYou.css";

const ThankYou = () => {
    const location = useLocation();
    console.log("Location State:", location.state); // Debugging log
    const { message } = location.state || {}; // Get the message from the state

    return (
        <div className="thank-you-format">
            <h1>Thank You!</h1>
            <p>{message}</p>
        </div>
    );
};

export default ThankYou;
