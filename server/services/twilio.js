// Import Twilio module
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();
// Your Twilio account SID and auth token from twilio.com/console
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = new twilio(accountSid, authToken);
// Function to send an SMS
async function sendSms(to, message) {
    try {
        const messageInstance = await client.messages.create({
            body: message,
            from: '+18554840809', // Your Twilio phone number
            to: to
        });

        console.log('Message sent:', messageInstance.body);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}

// Example usage
const sendMessage = sendSms('+12543507908', 'We have received your order! Thank you for choosing our service.');
console.log(sendMessage);