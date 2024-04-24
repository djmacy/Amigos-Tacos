import PayPalButtons from "../PayPalButtons.jsx";
import FoodCard from "../FoodCard.jsx";
import {useEffect, useState} from "react";

const Home = () => {
    const [totalPrice, setTotalPrice] = useState(0); // State to keep track of total price
    const [cart, setCart] = useState([]);
    const [foodCards, setFoodCards] = useState([
        { title: "Quesabirrias", hasOnions: true, hasCilantro: true, hasSalsaVerde: true, hasSalsaRojo: true, price: 4, maxQuantity: 3, quantity: 0},
        { title: "Loko Tacos", hasOnions: true, hasCilantro: true, price: 3, maxQuantity: 4, quantity: 0}
    ]);


    const handleQuantityChange = (index, newQuantity) => {
        const updatedFoodCards = [...foodCards];
        updatedFoodCards[index].quantity = newQuantity;
        setFoodCards(updatedFoodCards);
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

    return (
        <>
            {foodCards.map((foodCard, index) => (
                <FoodCard
                    key={index}
                    title={foodCard.title}
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
            <p>Total Price: ${totalPrice}</p>
            {totalPrice > 0 ?  <PayPalButtons cart={cart}/>: null}
        </>
    );
};

export default Home;
