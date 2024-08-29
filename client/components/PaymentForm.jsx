import { useState, useRef } from "react";
import styles from "./PaymentForm.module.css";
import { LoadingOverlay } from './LoadingOverlay';
import { useNavigate } from 'react-router-dom';



import {
  PayPalHostedFieldsProvider,
  PayPalHostedField,
  PayPalButtons,
  usePayPalHostedFields,
} from "@paypal/react-paypal-js";
//**********Cart must be a list of objects

async function createOrderCallback(cart) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // use the "body" param to optionally pass additional order information
      // like product ids and quantities
      body: JSON.stringify({
        cart: cart,
      }),
    });
    //console.log(cart);

    const orderData = await response.json();

    if (orderData.id) {
      return orderData.id;
    } else {
      const errorDetail = orderData?.details?.[0];
      const errorMessage = errorDetail
        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
        : JSON.stringify(orderData);

      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error);
    return `Could not initiate PayPal Checkout...${error}`;
  }
}

async function onApproveCallback(data, actions, cart) {
  try {
    const response = await fetch(`/api/orders/${data.orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const orderData = await response.json();

    const transaction =
        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
    const errorDetail = orderData?.details?.[0];

    if (errorDetail?.issue === "INSTRUMENT_DECLINED" && actions) {
      return actions.restart();
    } else if (
        errorDetail ||
        !transaction ||
        transaction.status === "DECLINED"
    ) {
      let errorMessage;
      if (transaction) {
        errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
      } else if (errorDetail) {
        errorMessage = `${errorDetail.description} (${orderData.debug_id})`;
      } else {
        errorMessage = JSON.stringify(orderData);
      }
      throw new Error(errorMessage);
    } else {
      const createOrderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderDetails: cart }),
      });

      const createOrderData = await createOrderResponse.json();
      if (!createOrderResponse.ok) {
        throw new Error(`Order creation failed: ${createOrderData.error}`);
      }

      const orderId = createOrderData.orderId;

      const resultMessage = `Transaction ${transaction.status.toLowerCase()}. Order ID: ${orderId}. We will contact you when your food is ready!`;
      window.location.assign(`/thank-you?message=${encodeURIComponent(resultMessage)}`);
      // Returning the message instead of navigating here
      return resultMessage;
    }
  } catch (error) {
    return `Sorry, your transaction could not be processed...${error}`;
  }
}

const SubmitPayment = ({ onHandleMessage, cart, setLoading }) => {
  const { cardFields } = usePayPalHostedFields();
  const cardHolderName = useRef(null);

  const submitHandler = () => {
    if (typeof cardFields.submit !== "function") return; // validate that `submit()` exists before using it
    setLoading(true);
    cardFields
        .submit({
          cardholderName: cardHolderName?.current?.value,
        })
        .then(async (data) => {
          await onHandleMessage(await onApproveCallback(data, undefined, cart));
          setLoading(false);
        })
        .catch((orderData) => {
          onHandleMessage(
              `Sorry, your transaction could not be processed...${JSON.stringify(orderData)}`,
          );
          setLoading(false);
        });
  };

  return (
      <button onClick={submitHandler} className="btn btn-primary">
        Pay
      </button>
  );
};

const Message = ({ content }) => {
  return <p>{content}</p>;
};

export const PaymentForm = ({ cart }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleApprove = async (data) => {
    const resultMessage = await onApproveCallback(data, undefined, cart);
    setLoading(false);
    setMessage(resultMessage);


      //navigate('/thank-you')

  };

  return (

      <div className={styles.form}>
        <PayPalButtons
            style={{
              shape: "rect",
              layout: "vertical",
            }}
            createOrder={() => createOrderCallback(cart)}
            onApprove={handleApprove}
        />

        <PayPalHostedFieldsProvider createOrder={() => createOrderCallback(cart)}>
          <div style={{ marginTop: "4px", marginBottom: "4px" }}>
            <PayPalHostedField
                id="card-number"
                hostedFieldType="number"
                options={{
                  selector: "#card-number",
                  placeholder: "Card Number",
                }}
                className={styles.input}
            />
            <div className={styles.container}>
              <PayPalHostedField
                  id="expiration-date"
                  hostedFieldType="expirationDate"
                  options={{
                    selector: "#expiration-date",
                    placeholder: "Expiration Date",
                  }}
                  className={styles.input}
              />
              <PayPalHostedField
                  id="cvv"
                  hostedFieldType="cvv"
                  options={{
                    selector: "#cvv",
                    placeholder: "CVV",
                  }}
                  className={styles.input}
              />
            </div>
            <div className={styles.container}>
              <input
                  id="card-holder"
                  type="text"
                  placeholder="Name on Card"
                  className={styles.input}
              />
              <input
                  id="card-billing-address-country"
                  type="text"
                  placeholder="Billing Zip Code"
                  className={styles.input}
              />
            </div>
            <SubmitPayment onHandleMessage={setMessage} cart={cart} setLoading={setLoading} />
          </div>
        </PayPalHostedFieldsProvider>
        <Message content={message} />
        {loading && <LoadingOverlay />}

      </div>
  );
};