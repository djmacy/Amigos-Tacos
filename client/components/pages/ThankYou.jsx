import { useLocation } from 'react-router-dom';
import "./ThankYou.css";

const ThankYou = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(window.location.search);
    const message = queryParams.get('message'); // Get the message from the query parameters

    return (
        <div className="thank-you-format">
            <h1>Thank You!</h1>
            <p>{message}</p>
        </div>
    );
};

export default ThankYou;
