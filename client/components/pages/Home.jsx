import PayPalButtons from "../PayPalButtons.jsx";
import FoodCard from "../FoodCard.jsx";
import React, { useEffect, useState } from "react";
import "./Home.css";
import birriaPicture from "../../images/AmigosTacosLogo.png";

const Home = () => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [cart, setCart] = useState([]);
    const [isDelivery, setDelivery] = useState(false);
    const [foodCards, setFoodCards] = useState([
        { title: "Quesabirrias", imageUrl: birriaPicture, hasOnions: true, hasCilantro: true, price: 4, maxQuantity: 3, quantity: 0 },
        { title: "Loko Taco", imageUrl: birriaPicture, hasOnions: true, hasCilantro: true, price: 3, maxQuantity: 4, quantity: 0 },
        { title: "Carne Asada Taco", imageUrl: birriaPicture, hasOnions: true, hasCilantro: true, price: 3, maxQuantity: 4, quantity: 0 }
    ]);
    const [paypalButtonTrigger, setPaypalButtonTrigger] = useState(false);

    const handleQuantityChange = (index, newQuantity) => {
        const updatedFoodCards = [...foodCards];
        updatedFoodCards[index].quantity = newQuantity;
        setFoodCards(updatedFoodCards);
        setPaypalButtonTrigger(false);
    };

    useEffect(() => {
        let total = 0;
        let newCart = [];
        foodCards.forEach(foodCard => {
            total += foodCard.price * foodCard.quantity;
            newCart.push({ id: foodCard.title, quantity: foodCard.quantity });
        });
        setTotalPrice(total);
        if (isDelivery) {
            setTotalPrice(total + 5);
        }
        setCart(newCart);
    }, [foodCards]);

    const handleDeliveryChange = (event) => {
        setDelivery(prevState => {
            const newDeliveryState = event.target.checked;
            setTotalPrice(prevTotalPrice => prevTotalPrice + (newDeliveryState ? 5 : -5));
            return newDeliveryState;
        });
    };

    const handlePayPalButtonClick = () => {
        setPaypalButtonTrigger(true);
    };

    return (
        <div>
            <div className="food-cards-container">
                {foodCards.map((foodCard, index) => (
                    <FoodCard
                        key={index}
                        title={foodCard.title}
                        imageUrl={foodCard.imageUrl}
                        hasOnions={foodCard.hasOnions}
                        hasCilantro={foodCard.hasCilantro}
                        price={foodCard.price}
                        maxQuantity={foodCard.maxQuantity}
                        quantity={foodCard.quantity}
                        onQuantityChange={newQuantity => handleQuantityChange(index, newQuantity)}
                        cardIndex={index} // Pass the cardIndex prop
                    />
                ))}
            </div>
            <div className="total-price">
                {totalPrice > 0 && (
                    <label>
                        Deliver My Food:
                        <input type="checkbox" name="delivery" checked={isDelivery} onChange={handleDeliveryChange} />
                    </label>
                )}
                <p>Total Price: ${totalPrice}</p>
                <button onClick={handlePayPalButtonClick} className="paypal-button">
                    Generate Checkout
                </button>
            </div>
            <div className="pay-pal-buttons-home">
                {totalPrice > 0 && paypalButtonTrigger ? <PayPalButtons cart={cart} /> : null}
            </div>
        </div>
    );
};

export default Home;
