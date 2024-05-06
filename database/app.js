import express from "express";
const app = express();

import {getOrderDetails, insertOrder, getOrders} from "./database.js";

app.get("/orders", async (req,res) => {
    //res.send("Get request")
    const orders = await getOrders();
    res.send(orders);
});

//app.post("/")

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke in with database!')
});

app.listen(8080, () => {
    console.log('server is running on port 8080')
});