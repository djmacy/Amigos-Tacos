import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext.jsx';
import './Orders.css';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [nonCompletedOrders, setNonCompletedOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    //console.log(orders);
    const [loading, setLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchTodaysNonCompletedOrders();
            fetchTodaysCompletedOrders();
        }
    }, [isAuthenticated]);

    const fetchTodaysNonCompletedOrders = async () => {
        try {
            const response = await fetch('/api/todays-non-completed-orders');
            if (response.ok) {
                const ordersData = await response.json();
                const orderIds = ordersData.map(order => order.id);
                //console.log(orderIds)
                // Fetch details for each order
                const detailsPromises = orderIds.map(id => fetchOrderDetails(id));
                const details = await Promise.all(detailsPromises);
               // console.log(details)
                // Combine order data with details
                const ordersWithDetails = ordersData.map((order, index) => ({
                    ...order,
                    details: details[index], // Assign the details corresponding to the order
                }));

                setNonCompletedOrders(ordersWithDetails);
            } else {
                console.error('Failed to fetch orders:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTodaysCompletedOrders = async () => {
        try {
            const response = await fetch('/api/todays-completed-orders');
            if (response.ok) {
                const ordersData = await response.json();
                const orderIds = ordersData.map(order => order.id);
                //console.log(orderIds)
                // Fetch details for each order
                const detailsPromises = orderIds.map(id => fetchOrderDetails(id));
                const details = await Promise.all(detailsPromises);
               // console.log(details)
                // Combine order data with details
                const ordersWithDetails = ordersData.map((order, index) => ({
                    ...order,
                    details: details[index], // Assign the details corresponding to the order
                }));

                setCompletedOrders(ordersWithDetails);
                console.log(ordersWithDetails)
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

    const updateOrderStatus = async (orderId) => {
        try {
            const response = await fetch('/api/update-order-ready', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId })
            });

            if (response.ok) {
                console.log('Order ready status updated successfully');
            } else {
                console.error('Failed to update order ready status');
            }
        } catch (error) {
            console.error('Error updating order ready status:', error);
        }
    };

    const handleCheckboxChange = (orderId, event) => {
        const checked = event.target.checked;
        setNonCompletedOrders(nonCompletedOrders.map(order =>
            order.id === orderId ? { ...order, isCompleted: checked } : order
        ));
        setIsReady(checked);
    };

    const handleConfirmClick = (orderId) => {
        // Add functionality for confirming the order
        if (isReady) {
            updateOrderStatus(orderId);
            setNonCompletedOrders(nonCompletedOrders.filter(order => order.id !== orderId));
            location.reload();
           // console.log(`Order ${orderId} confirmed`);

        }
    };

    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
        navigate('/login');
        return null; // Don't render the Orders component
    }

    return (
        <div>
            <div className='orders'>
                <h1>Today's New Orders</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    nonCompletedOrders.length > 0 ? (
                        nonCompletedOrders.map(order => (
                            <div key={order.id} className='order-details'>
                                <h2>Order ID: {order.id}</h2>
                                {order.details && order.details[0] ? (
                                    <>
                                        <p><strong>Customer Name:</strong> {order.details[0].customer_name}</p>
                                        <p><strong>Phone:</strong> {order.details[0].customer_phone}</p>
                                        <p><strong>Email:</strong> {order.details[0].customer_email}</p>
                                        <p>
                                            <strong>Address:</strong> {order.details[0].customer_address}, {order.details[0].customer_city}
                                        </p>
                                        <p><strong>Is Delivery:</strong> {order.is_delivery}</p>
                                        <p><strong>Has Salsa Verde:</strong> {order.has_salsa_verde}</p>
                                        <p><strong>Has Salsa Rojo:</strong> {order.has_salsa_rojo}</p>
                                        <p><strong>Mexican Cokes:</strong> {order.mexican_cokes}</p>
                                        <p><strong>Waters:</strong> {order.waters}</p>
                                        <p><strong>Horchatas:</strong> {order.horchata}</p>
                                        <p><strong>Jamaicas:</strong> {order.jamaica}</p>
                                        <h3>Items:</h3>
                                        <ul className="order-items">
                                            {order.details.map((item, index) => (
                                                <li key={index}>
                                                    {item.item_name} - Quantity: {item.quantity}
                                                    <ul>
                                                        <li>Meat: {item.meat}</li>
                                                        <li>Cilantro: {item.has_cilantro}</li>
                                                        <li>Onions: {item.has_onion}</li>
                                                    </ul>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <p>Order Completed!</p>
                                )}
                                <div className="order-completed-row">
                                    <h3>Order Completed? </h3>
                                    <input
                                        type="checkbox"
                                        checked={order.isCompleted || false}
                                        onChange={(e) => handleCheckboxChange(order.id, e)}
                                    />
                                </div>
                                {isReady && (
                                    <button
                                        className="completed-confirmation"
                                        onClick={() => handleConfirmClick(order.id)}
                                    >
                                        Confirm
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No new orders found.</p>
                    )
                )}
            </div>

            <div className='orders'>
                <h1>Today's Completed Orders</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    completedOrders.length > 0 ? (
                        completedOrders.map(order => (
                            <div key={order.id} className='order-details'>
                                <h2>Order ID: {order.id}</h2>
                                {order.details && order.details[0] ? (
                                    <>
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
                                        <ul className="order-items">
                                            {order.details.map((item, index) => (
                                                <li key={index}>
                                                    {item.item_name} - Quantity: {item.quantity}
                                                    <ul>
                                                        <li>Meat: {item.meat}</li>
                                                        <li>Cilantro: {item.has_cilantro}</li>
                                                        <li>Onions: {item.has_onion}</li>
                                                    </ul>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <p>No details available.</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No completed orders found.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default Orders;
