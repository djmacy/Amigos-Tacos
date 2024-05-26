import express from "express";
import "dotenv/config";
import path from "path";

import { generateClientToken, createOrder, captureOrder } from './services/paypal.js';
import { getTodaysOrders, insertOrder, getFoodDetails, getOrderDetails, authenticateUser } from './services/database.js';

const PORT = process.env.PORT || 8888;
const base = "https://api-m.sandbox.paypal.com";
const app = express();

app.use(express.static("client/dist"));
// parse post params sent in body in json format
app.use(express.json());


// serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./client/dist/index.html"));
});

/**
 * DB RESTFUL
 */
// Example route to use the database functions directly
app.get("/api/todays-orders", async (req, res) => {
  try {
    const orders = await getTodaysOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/create-order", async (req, res) => {
  try {
    const { orderDetails } = req.body;
    const { orderId } = await insertOrder(orderDetails);
    res.status(201).json({ orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/order-details/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderDetails = await getOrderDetails(orderId);
    res.json(orderDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/order-food-details/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const foodDetails = await getFoodDetails(orderId);
    res.json(foodDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/user-auth", async (req, res) => {
  try {
    const { credentials } = req.body;

    const isAuthenticated = await authenticateUser(credentials);

    if (isAuthenticated) {
      res.status(201).send({isAuthenticated: isAuthenticated});
    } else {
      res.status(401).send({isAuthenticated: isAuthenticated});
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).send("Internal server error");
  }
});


/**
 * PAYPAL RESTFUL
 */

// return client token for hosted-fields component
app.post("/api/token", async (req, res) => {
  try {
    const { jsonResponse, httpStatusCode } = await generateClientToken();
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to generate client token:", error);
    res.status(500).send({ error: "Failed to generate client token." });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

app.listen(PORT, () => {
  console.log(`Node server listening at http://localhost:${PORT}/`);
});
