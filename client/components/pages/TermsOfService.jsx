import React from "react";
import "./TermsOfService.css"; // Assuming the styles are saved here

const TermsOfService = () => {
    return (
        <div className="terms-container">
            <h3 className="terms-title">Terms and Conditions</h3>
            <p className="terms-item">
                1) This campaign sends order confirmations and reminder messages to customers once they have placed an
                order with Amigos Tacos on our website and opted-in to receive notification SMS from Amigos Tacos.
            </p>
            <p className="terms-item">
                2) You can cancel the SMS service at any time. Simply text "STOP" to the shortcode. Upon sending "STOP," we
                will confirm your unsubscribe status via SMS. Following this confirmation, you will no longer receive
                SMS messages from us. To rejoin, sign up as you did initially, and we will resume sending SMS messages
                to you.
            </p>
            <p className="terms-item">
                3) If you experience issues with the messaging program, reply with the keyword HELP for more assistance, or
                reach out directly to <a className="terms-link"
                                         href="mailto:support@amigostacosmt.com">support@amigostacosmt.com</a>.
            </p>
            <p className="terms-item">
                4) Carriers are not liable for delayed or undelivered messages.
            </p>
            <p className="terms-item">
                5) As always, message and data rates may apply for messages sent to you from us and to us from you. Message
                frequency varies. For questions about your text plan or data plan, contact your wireless provider.
            </p>
            <p className="terms-item">
                6) For privacy-related inquiries, please refer to our privacy policy: <a className="terms-link"
                                                                                      href="/privacy-policy">Privacy
                Policy</a>.
            </p>
        </div>

    );
};

export default TermsOfService;
