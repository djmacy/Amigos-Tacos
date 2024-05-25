import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PaymentForm } from "./PaymentForm.jsx";
import { useState, useEffect } from "react";

const PayPalButtons = ({cart}) => {
   // console.log(cart);
    const [clientToken, setClientToken] = useState(null);

    const initialOptions = {
        "client-id": "AYTR7blQ_1MJ-g9hZ6ThmvZwM-MO26CXTyhsEGCIo1njhdOqCw8BEaqdcbhT-PZKnzU-6wyQF8HLEEED",
        "data-client-token": clientToken,
        components: "hosted-fields,buttons",
        "enable-funding": "venmo",
        "disable-funding": "paylater",
        "data-sdk-integration-source": "integrationbuilder_ac",
    };

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/token", {
                method: "POST",
            });
            const { client_token } = await response.json();
            setClientToken(client_token);
        })();
    }, []);
    return (
        <>
            {clientToken ? (
                <PayPalScriptProvider options={initialOptions}>
                    <PaymentForm cart={cart}/>
                </PayPalScriptProvider>
            ) : (
                <h4>WAITING ON CLIENT TOKEN</h4>
            )}
        </>
    );
};

export default PayPalButtons;
