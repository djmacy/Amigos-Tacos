import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext.jsx';
import './Orders.css';

const Orders = () => {
    const { isAuthenticated } = useAuth();
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
                const data = await response.json();
                setOrders(data);
                console.log(data)
            } else {
                console.error('Failed to fetch orders:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
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
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>{order.has_salsa_verde}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Orders;
