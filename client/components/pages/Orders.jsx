import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext.jsx';
import './Orders.css';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [orderIds, setOrderIds] = useState([]);
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
                const data = await response.json();
                const ids = data.map(order => order.id); // Extract only the order IDs
                setOrderIds(ids);
                console.log(ids);
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
                const data = await response.json();
                console.log(data);
            } else {
                console.error('Failed to fetch order details:', response.statusText);
            }
        } catch (e) {
            console.error('Error fetching details:', e);
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
                <ul className='order-list'>
                    {orderIds.map(id => (
                        <li key={id} onClick={() => fetchOrderDetails(id)}>{id}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Orders;
