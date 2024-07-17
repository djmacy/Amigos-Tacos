import { useState, useRef } from "react";
import styles from "./PaymentForm.module.css";

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
  console.log("onApproveCallback cart:", cart); // Add this line for debugging
  try {
    const response = await fetch(`/api/orders/${data.orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const orderData = await response.json();
    // Three cases to handle:
    //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
    //   (2) Other non-recoverable errors -> Show a failure message
    //   (3) Successful transaction -> Show confirmation or thank you message

    const transaction =
        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
    const errorDetail = orderData?.details?.[0];

    // this actions.restart() behavior only applies to the Buttons component
    if (errorDetail?.issue === "INSTRUMENT_DECLINED" && !data.card && actions) {
      // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
      return actions.restart();
    } else if (
        errorDetail ||
        !transaction ||
        transaction.status === "DECLINED"
    ) {
      // (2) Other non-recoverable errors -> Show a failure message
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
      // (3) Successful transaction -> Show confirmation or thank you message
      // Or go to another URL:  actions.redirect('thank_you.html');
      //console.log(orderData.status);
      //console.log(orderData)
      //console.log(transaction.status);
      //console.log(transaction);
      //console.log()
      // Extract order details from orderData

    /*  const orderDetails = {
        isDelivery: 'Yes',
        isReady: 'No',
        hasSalsaVerde: 'Yes',
        hasSalsaRojo: 'No',
        mexicanCokes: 2,
        totalPrice: 24.95,
        items: [
          {
            itemId: 1, // Quesabirria
            quantity: 1,
            hasCilantro: 'Yes',
            hasOnion: 'Yes',
            meat: 'birria'
          },
          {
            itemId: 1, // Quesabirria with cheese
            quantity: 1,
            hasCilantro: 'Yes',
            hasOnion: 'Yes',
            meat: 'birria with cheese'
          },
          {
            itemId: 3, // Loko Taco
            quantity: 1,
            hasCilantro: 'No',
            hasOnion: 'Yes',
            meat: 'carne asada'
          }
        ]
      };*/

      // Send order details to the backend
      const createOrderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderDetails: cart} ),
      });
      console.log("From Payment" + cart);
      //console.log(orderDetails);

      const createOrderData = await createOrderResponse.json();
      if (!createOrderResponse.ok) {
        throw new Error(`Order creation failed: ${createOrderData.error}`);
      }

      console.log(`Order ID: ${createOrderData.orderId}`);

      return `Transaction ${transaction.status}: ${transaction.id}. Order ID: ${createOrderData.orderId}. See console for all available details`;
    }
  } catch (error) {
    return `Sorry, your transaction could not be processed...${error}`;
  }
}


const SubmitPayment = ({ onHandleMessage, cart }) => {
  // Here declare the variable containing the hostedField instance
  const { cardFields } = usePayPalHostedFields();
  const cardHolderName = useRef(null);

  const submitHandler = () => {
    if (typeof cardFields.submit !== "function") return; // validate that \`submit()\` exists before using it
    //if (errorMsg) showErrorMsg(false);
    cardFields
      .submit({
        // The full name as shown in the card and billing addresss
        // These fields are optional for Sandbox but mandatory for production integration
        cardholderName: cardHolderName?.current?.value,
      })
      .then(async (data) => onHandleMessage(await onApproveCallback(data, undefined, cart)))
      .catch((orderData) => {
        onHandleMessage(
          `Sorry, your transaction could not be processed...${JSON.stringify(
            orderData,
          )}`,
        );
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

  const handleApprove = async (data) => {
    console.log("handleApprove cart:", cart); // Add this line for debugging
    const resultMessage = await onApproveCallback(data, undefined, cart);
    setMessage(resultMessage);
  };

  return (
      <div className={styles.form}>
        <PayPalButtons
            style={{
              shape: "rect",
              layout: "vertical",
            }}
            styles={{ marginTop: "4px", marginBottom: "4px" }}
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
            <SubmitPayment onHandleMessage={setMessage} cart={cart} />
          </div>
        </PayPalHostedFieldsProvider>
        <Message content={message} />
      </div>
  );
};
