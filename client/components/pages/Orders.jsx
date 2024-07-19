import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext.jsx';
import './Orders.css';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchTodaysOrders();
        }
    }, [isAuthenticated]);

    const fetchTodaysOrders = async () => {
        try {
            const response = await fetch('/api/todays-orders');
            if (response.ok) {
                const ordersData = await response.json();
                const orderIds = ordersData.map(order => order.id);

                // Fetch details for each order
                const detailsPromises = orderIds.map(id => fetchOrderDetails(id));
                const details = await Promise.all(detailsPromises);

                // Combine order data with details
                const ordersWithDetails = ordersData.map((order, index) => {
                    return {
                        ...order,
                        details: details[index], // Assign the details corresponding to the order
                    };
                });

                setOrders(ordersWithDetails);
                console.log(orders)
            } else {
                console.error('Failed to fetch orders:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };


    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await fetch(`/api/order-food-details/${orderId}`);
            if (response.ok) {
                return await response.json(); // Return the details for this order
            } else {
                console.error('Failed to fetch order details:', response.statusText);
                return {}; // Return an empty object in case of error
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            return {}; // Return an empty object in case of error
        }
    };

    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
        navigate('/login');
        return null; // Don't render the Orders component
    }

    return (
        <div className='orders'>
            <h1>Orders Page</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order.id} className='order-details'>
                            <h2>Order ID: {order.id}</h2>
                            <p><strong>Customer Name:</strong> {order.details[0].customer_name}</p>
                            <p><strong>Phone:</strong> {order.details[0].customer_phone}</p>
                            <p><strong>Email:</strong> {order.details[0].customer_email}</p>
                            <p><strong>Address:</strong> {order.details[0].customer_address}, {order.details[0].customer_city}</p>
                            <p><strong>Is Delivery:</strong> {order.is_delivery}</p>
                            <p><strong>Has Salsa Verde:</strong> {order.has_salsa_verde}</p>
                            <p><strong>Has Salsa Rojo:</strong> {order.has_salsa_rojo}</p>
                            <p><strong>Mexican Cokes:</strong> {order.mexican_cokes}</p>
                            <p><strong>Waters:</strong> {order.waters}</p>
                            <h3>Items:</h3>
                            {order.details && order.details.length > 0 ? (
                                <ul>
                                    {order.details.map((item, index) => (
                                        <li key={index}>
                                            {item.item_name} - Quantity: {item.quantity}
                                            <ul>
                                                <li>Cilantro: {item.has_cilantro}</li>
                                                <li>Onions: {item.has_onion}</li>
                                                <li>Meat: {item.meat}</li>
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No items found.</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No orders found.</p>
                )
            )}
        </div>
    );
};

export default Orders;
