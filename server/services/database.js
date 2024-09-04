import mysql from 'mysql2';
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getTodaysNonCompletedOrders() {
    try {
        const [rows] = await pool.query("SELECT * FROM orders WHERE DATE(time_ordered) = CURDATE() and orders.is_ready = 'No'");
        return rows;
    } catch (error) {
        // Handle any errors
        console.error("Error fetching orders:", error);
        throw error;
    }
}

export async function getTodaysCompletedOrders() {
    try {
        const [rows] = await pool.query("SELECT * FROM orders WHERE DATE(time_ordered) = CURDATE() and orders.is_ready = 'Yes'");
        return rows;
    } catch (error) {
        // Handle any errors
        console.error("Error fetching orders:", error);
        throw error;
    }
}

export async function insertOrder(orderDetails) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Insert into customer table
        const [customerResult] = await connection.query(
            "INSERT INTO customer (name, phone, email, address, city) VALUES (?, ?, ?, ?, ?)",
            [orderDetails.customer.name, orderDetails.customer.phone, orderDetails.customer.email, orderDetails.customer.address, orderDetails.customer.city]
        );
        const customerId = customerResult.insertId; // Get the customer_id of the newly inserted customer

        // Insert into orders table with customer_id
        const [orderResult] = await connection.query(
            "INSERT INTO orders (is_delivery, is_ready, has_salsa_verde, has_salsa_rojo, mexican_cokes, waters, total_price, customer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [orderDetails.isDelivery, orderDetails.isReady, orderDetails.hasSalsaVerde, orderDetails.hasSalsaRojo, orderDetails.mexicanCokes, orderDetails.waters, orderDetails.totalPrice, customerId]
        );
        const orderId = orderResult.insertId; // Get the order_id of the newly inserted order

        // Insert into order_items table for each item in the order
        for (const item of orderDetails.items) {
            // Insert topping details for the item into the toppings table
            const [toppingResult] = await connection.query(
                "INSERT INTO toppings (has_cilantro, has_onion, meat) VALUES (?, ?, ?)",
                [item.hasCilantro, item.hasOnion, item.meat]
            );
            const toppingId = toppingResult.insertId; // Get the topping_id of the newly inserted topping

            // Insert item into order_items table
            await connection.query(
                "INSERT INTO order_items (order_id, item_id, topping_id, quantity) VALUES (?, ?, ?, ?)",
                [orderId, item.itemId, toppingId, item.quantity]
            );
        }

        await connection.commit();
        return {orderId}; // Return the order_id for reference
    } catch (error) {
        await connection.rollback();
        console.error("Error inserting order:", error);
        throw error;
    } finally {
        connection.release();
    }
}


export async function getFoodDetails(orderId) {
    try {
        // Execute the SQL query to retrieve order details
        const [rows] = await pool.query(`
            SELECT 
                o.id AS order_id,
                o.waters,
                o.mexican_cokes,
                o.has_salsa_rojo,
                o.has_salsa_verde,
                o.is_delivery,
                i.name AS item_name, 
                oi.quantity AS quantity, 
                t.has_cilantro AS has_cilantro, 
                t.has_onion AS has_onion, 
                t.meat AS meat,
                c.name AS customer_name,
                c.phone AS customer_phone,
                c.email AS customer_email,
                c.address AS customer_address,
                c.city AS customer_city
            FROM 
                order_items oi
            JOIN 
                items i ON oi.item_id = i.id
            JOIN 
                toppings t ON oi.topping_id = t.id
            JOIN 
                orders o ON oi.order_id = o.id
            JOIN 
                customer c ON o.customer_id = c.id
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

export async function getTodaysFoodDetails() {
    try {
        // Execute the SQL query to retrieve order details for orders placed today
        const [rows] = await pool.query(`
            SELECT 
                o.id AS id,
                i.name AS item_name,
                oi.quantity AS quantity,
                t.has_cilantro AS has_cilantro,
                t.has_onion AS has_onion,
                t.meat AS meat
            FROM 
                order_items oi
            JOIN 
                items i ON oi.item_id = i.id
            JOIN 
                toppings t ON oi.topping_id = t.id
            JOIN 
                orders o ON oi.order_id = o.id
            WHERE 
                DATE(o.time_ordered) = CURDATE()
            ORDER BY 
                o.id
        `);

        return rows; // Return the retrieved order details
    } catch (error) {
        // Handle any errors
        console.error("Error fetching today's order details:", error);
        throw error;
    }
}

export async function getOrderDetails(orderId) {
    try {
        // Execute the SQL query to retrieve order details
        const [rows] = await pool.query(`
            SELECT 
                id AS order_id,
                is_delivery,
                is_ready,
                total_price,
                time_ordered,
                mexican_cokes,
                has_salsa_verde,
                has_salsa_rojo
            FROM 
                orders
            WHERE 
                id = ?
        `, [orderId]);

        // Assuming each orderId corresponds to a single order, return the first row if it exists
        if (rows.length > 0) {
            return rows[0];
        } else {
            throw new Error(`Order with ID ${orderId} not found.`);
        }
    } catch (error) {
        // Handle any errors
        console.error("Error fetching order details:", error);
        throw error;
    }

}

export async function authenticateUser(credentials) {
    if (!credentials.username || !credentials.password) {
        console.error("Username and Password are mandatory")
        return
    }
    try {
        const username = credentials.username;
        const password = credentials.password;
        // Execute a parameterized query to select the user with the given username and password
        const [rows] = await pool.query(
            "SELECT * FROM kitchen_staff WHERE username = ? AND password = ?",
            [username, password]
        );
        //console.log(rows.length > 0)
        // If there's a matching user, return true; otherwise, return false
        return rows.length > 0;
    } catch (error) {
        // Handle any errors
        console.error("Error authenticating user:", error);
        throw error;
    }
}

export async function updateOrderReadyStatus(orderId) {
    try {
        const [result] = await pool.query("UPDATE orders SET is_ready = 'Yes' WHERE id = ?", [orderId]);
        return result;
    } catch (error) {
        // Handle any errors
        console.error("Error updating order ready status:", error);
        throw error;
    }
}
/*
authenticateUser('kitchenUser', 'password123').then(isAuthenticated => {
    if (isAuthenticated) {
        console.log("user authenticated")
    } else {
        console.log("authentication failed")
    }
}).catch(error => {
    console.error("Error: ", error);
    }
);
*/

/*
// Example usage to get the food details for a specific order ID
getFoodDetails(1).then(foodDetails => {
    console.log('Food Details:', foodDetails);
}).catch(error => {
    console.error('Error:', error);
});
*/
 
/*
getOrderDetails(1).then(orderDetails => {
    console.log('Order Details:', orderDetails);
}).catch(error => {
    console.error('Error:', error);
});
*/
/*
const orderDetails = {
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
};

insertOrder(orderDetails).then(orderId => {
    console.log(`Order inserted with ID: ${orderId}`);
}).catch(error => {
    console.error("Error inserting order:", error);
});

*/
//const orders = await getOrders();
//const insertOrders = await insertOrder(orderDetails);
//const getOrderItems = await getOrderDetails(12);
//const getFoodItems = await getFoodDetails(12)
//const getTodayOrders = await getTodaysCompletedOrders();
//const getTodaysFoodItems = await getTodaysFoodDetails();
//console.log(getTodaysFoodItems)

//console.log(orders);
//console.log(insertOrders);
//console.log(getTodayOrders);
/*
import bcrypt from 'bcrypt';
const saltRounds = 10;
const myPlaintextPassword = 'password123';
const someOtherPlaintextPassword = 'not_bacon';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    console.log(hash)
});
*/