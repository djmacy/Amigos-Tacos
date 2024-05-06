import mysql from 'mysql2';
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getOrders() {
    const [rows] = await pool.query("SELECT * FROM orders");
    return rows;
}

const orderDetails = {
    isDelivery: "Yes", // or "No"
    isReady: "No",     // or "Yes"
    totalPrice: 24.95, // Total price of the order

    items: [
        {
            itemId: 1,           // ID of the item (e.g., quesabirria, carne_taco, loko_taco)
            quantity: 2,         // Quantity of this item in the order
            hasCilantro: "Yes",  // Topping details for this item
            hasOnion: "Yes",
            hasSalsaVerde: "Yes",
            hasSalsaRojo: "No"
        },
        {
            itemId: 2,
            quantity: 1,
            hasCilantro: "No",
            hasOnion: "Yes",
            hasSalsaVerde: "Yes",
            hasSalsaRojo: "Yes"
        },
        // Add more items as needed
    ]
};

export async function insertOrder(orderDetails) {
    // Insert into orders table
    const [result] = await pool.query(
        "INSERT INTO orders (is_delivery, is_ready, total_price) VALUES (?, ?, ?)",
        [orderDetails.isDelivery, orderDetails.isReady, orderDetails.totalPrice]
    );
    const orderId = result.insertId; // Get the order_id of the newly inserted order
    // Insert into order_item table for each item in the order
    for (const item of orderDetails.items) {
        // Insert topping details for the item into the topping table
        const [toppingResult] = await pool.query(
            "INSERT INTO topping ( has_cilantro, has_onion, has_salsa_verde, has_salsa_rojo) VALUES ( ?, ?, ?, ?)",
            [item.hasCilantro, item.hasOnion, item.hasSalsaVerde, item.hasSalsaRojo]
        );

        const toppingId = toppingResult.insertId; // Get the item_id of the newly inserted item
        // Insert item into order_item table
       await pool.query(
            "INSERT INTO order_item (order_id, item_id, quantity, topping_id) VALUES (?, ?, ?, ?)",
            [orderId, item.itemId, item.quantity, toppingId]
        );
    }
    return orderId; // Return the order_id for reference
}

export async function getOrderDetails(orderId) {
    try {
        // Execute the SQL query to retrieve order details
        const [rows] = await pool.query(`
            SELECT 
                oi.item_id AS item_id,
                i.name AS item_name,
                oi.quantity AS quantity,
                t.has_cilantro AS has_cilantro,
                t.has_onion AS has_onion,
                t.has_salsa_verde AS has_salsa_verde,
                t.has_salsa_rojo AS has_salsa_rojo
            FROM 
                order_item oi
            JOIN 
                item i ON oi.item_id = i.id
            JOIN 
                topping t ON oi.topping_id = t.id
            WHERE 
                oi.order_id = ?
        `, [orderId]);

        return rows; // Return the retrieved order details
    } catch (error) {
        // Handle any errors
        console.error("Error fetching order details:", error);
        throw error;
    }
}

//const orders = await getOrders();
//const insertOrders = await insertOrder(orderDetails);
//const getOrderItems = await getOrderDetails(6);

//console.log(orders);
//console.log(insertOrders);
//console.log(getOrderItems);