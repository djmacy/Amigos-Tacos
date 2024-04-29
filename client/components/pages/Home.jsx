import PayPalButtons from "../PayPalButtons.jsx";
import FoodCard from "../FoodCard.jsx";
import {useEffect, useState} from "react";
import "./Home.css";
import birriaPicture from "../../images/AmigosTacosLogo.png"

const Home = () => {
    const [totalPrice, setTotalPrice] = useState(0); // State to keep track of total price
    const [cart, setCart] = useState([]);
    const [foodCards, setFoodCards] = useState([
        { title: "Quesabirrias", imageUrl: birriaPicture, hasOnions: true, hasCilantro: true, hasSalsaVerde: true, hasSalsaRojo: true, price: 4, maxQuantity: 3, quantity: 0},
        { title: "Taco Loko", imageUrl: birriaPicture, hasOnions: true, hasCilantro: true, hasSalsaVerde: true, hasSalsaRojo: true, price: 3, maxQuantity: 4, quantity: 0},
        { title: "Carne Tacos", imageUrl: birriaPicture, hasOnions: true, hasCilantro: true, hasSalsaVerde: true, hasSalsaRojo: true, price: 3, maxQuantity: 4, quantity: 0}
    ]);
    const [paypalButtonTrigger, setPaypalButtonTrigger] = useState(false);


    const handleQuantityChange = (index, newQuantity) => {
        const updatedFoodCards = [...foodCards];
        updatedFoodCards[index].quantity = newQuantity;
        setFoodCards(updatedFoodCards);
        // Set the PayPal button trigger to false to re-render the PayPal buttons
        setPaypalButtonTrigger(false);
    };

    useEffect(() => {
        let total = 0;
        let newCart = [];
        foodCards.forEach(foodCard => {
            total += foodCard.price * foodCard.quantity;
            newCart.push({id: foodCard.title, quantity: foodCard.quantity})
        });
        setTotalPrice(total);
        setCart(newCart);
    }, [foodCards]);


    const handlePayPalButtonClick = () => {
        // Do something when the PayPal button is clicked
        console.log("PayPal button clicked!");
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
                        hasSalsaVerde={foodCard.hasSalsaVerde}
                        hasSalsaRojo={foodCard.hasSalsaRojo}
                        price={foodCard.price}
                        maxQuantity={foodCard.maxQuantity}
                        quantity={foodCard.quantity}
                        onQuantityChange={newQuantity => handleQuantityChange(index, newQuantity)}
                    />
                ))}

            </div>
            <div className="total-price">
                <p>Total Price: ${totalPrice}</p>
                <button onClick={handlePayPalButtonClick} className="paypal-button">
                    Generate Checkout
                </button>
            </div>

            <div className="pay-pal-buttons-home">

                {totalPrice > 0 && paypalButtonTrigger ? <PayPalButtons cart={cart}/> : null}
            </div>
        </div>
    );
};

export default Home;
