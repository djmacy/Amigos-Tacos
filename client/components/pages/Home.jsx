import PayPalButtons from "../PayPalButtons.jsx";
import FoodCard from "../FoodCard.jsx";
import React, { useEffect, useState } from "react";
import "./Home.css";
import birriaPicture from "../../images/AmigosTacosLogo.png";
import foodCard from "../FoodCard.jsx";

const Home = () => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [cart, setCart] = useState({});
    const [isDelivery, setDelivery] = useState(false);
    const [salsaVerde, setSalsaVerde] = useState(true);
    const [salsaRojo, setSalsaRojo] = useState(true);
    const [mexicanCokes, setMexicanCokes] = useState(0); // State for Mexican Cokes quantity
    const cokePrice = 2;

    const [foodCards, setFoodCards] = useState([
        { title: "Quesabirrias", imageUrl: birriaPicture, hasOnions: true, hasCilantro: true, meatChoice: 'birria', hasSameToppings: true, price: 4, maxQuantity: 3, quantity: 0 },
        { title: "Loko Taco", imageUrl: birriaPicture, hasOnions: true, hasCilantro: true, meatChoice: 'birria', hasSameToppings: true, price: 3, maxQuantity: 4, quantity: 0 },
        { title: "Carne Asada Taco", imageUrl: birriaPicture, hasOnions: true, hasCilantro: true, meatChoice: 'birria', hasSameToppings: true, price: 3, maxQuantity: 4, quantity: 0 }
    ]);
    const [paypalButtonTrigger, setPaypalButtonTrigger] = useState(false);

    function containsItems() {
        var totalQuantity = 0;
        for (let i = 0; i < foodCards.length; i++) {
            totalQuantity += foodCards[i].quantity;
        }
        return totalQuantity <= 0;
    }

    function generateCart() {
        const items = foodCards.filter(foodCard => foodCard.quantity > 0).flatMap((foodCard, index) => {
            let itemId;
            switch (foodCard.title) {
                case 'Quesabirrias':
                    itemId = 1;
                    break;
                case 'Carne Asada Taco':
                    itemId = 2;
                    break;
                case "Loko Taco":
                    itemId = 3;
                    break;
                default:
                    itemId = '';
            }

            if (foodCard.hasSameToppings) {
                return {
                    itemId: itemId,
                    quantity: foodCard.quantity,
                    hasCilantro: foodCard.hasCilantro ? 'Yes' : 'No',
                    hasOnion: foodCard.hasOnions ? 'Yes' : 'No',
                    meat: foodCard.meatChoice
                };
            } else {
                let itemList = [];
                for (let i = 0; i < foodCard.quantity; i++) {
                    itemList.push(
                        {
                            itemId: itemId,
                            quantity: 1,
                            hasCilantro: foodCard.hasCilantro[i] ? 'Yes' : 'No',
                            hasOnion: foodCard.hasOnions[i] ? 'Yes' : 'No',
                            meat: foodCard.meatChoice[i]
                        }
                    );
                }

                return itemList


                /*Array.from({ length: foodCard.quantity }).map(() => ({
                    itemId: itemId,
                    quantity: 1,
                    hasCilantro: foodCard.hasCilantro ? 'Yes' : 'No',
                    hasOnion: foodCard.hasOnions ? 'Yes' : 'No',
                    meat: foodCard.meatChoice
                }));*/
            }
        });

        const orderDetails = {
            isDelivery: isDelivery ? 'Yes' : 'No',
            isReady: 'No',
            hasSalsaVerde: salsaVerde ? 'Yes' : 'No',
            hasSalsaRojo: salsaRojo ? 'Yes' : 'No',
            mexicanCokes: mexicanCokes,
            totalPrice: totalPrice.toFixed(2),
            items: items
        };

        console.log(orderDetails);
        return orderDetails;
    }


    const handleQuantityChange = (index, newQuantity) => {
        const updatedFoodCards = [...foodCards];
        updatedFoodCards[index].quantity = newQuantity;
        setFoodCards(updatedFoodCards);
        setPaypalButtonTrigger(false);
    };

    useEffect(() => {
        let total = 0;
        foodCards.forEach(foodCard => {
            total += foodCard.price * foodCard.quantity;
        });

        if (isDelivery) {
            total += 5;
        }
        if (mexicanCokes > 0) {
            total += mexicanCokes * cokePrice;
        }
        setTotalPrice(total);
    }, [foodCards]);

    const handleOnionsChange = (index, hasOnions) => {
        const updatedFoodCards = [...foodCards];
        updatedFoodCards[index].hasOnions = hasOnions;
        setFoodCards(updatedFoodCards);
    };


    const handleCilantroChange = (index, hasCilantro) => {
        const updatedFoodCards = [...foodCards];
        updatedFoodCards[index].hasCilantro = hasCilantro;
        setFoodCards(updatedFoodCards);
    }



    const handleMeatChoiceChange = (index, newMeatChoice) => {
        const updatedFoodCards = [...foodCards];
        updatedFoodCards[index].meatChoice = newMeatChoice;
        setFoodCards(updatedFoodCards);
        console.log(updatedFoodCards)
    };

    const handleSameToppingsChange = (index, hasSameToppings) => {
        const updatedFoodCards = [...foodCards];
        updatedFoodCards[index].hasSameToppings = hasSameToppings;
        setFoodCards(updatedFoodCards)
    }

    const handleDeliveryChange = (event) => {
        setDelivery(prevState => {
            const newDeliveryState = event.target.checked;
            setTotalPrice(prevTotalPrice => prevTotalPrice + (newDeliveryState ? 5 : -5));
            return newDeliveryState;
        });
    };

    const handleSalsaVerdeChange = (event) => {
        setSalsaVerde(event.target.checked);
    }

    const handleSalsaRojoChange = (event) => {
        setSalsaRojo(event.target.checked);
    }

    const handleMexicanCokesChange = (event) => {
        const newQuantity = parseInt(event.target.value);
        const oldPrice = mexicanCokes * cokePrice
        const cokePriceAdjustment = newQuantity * cokePrice;
        setTotalPrice(prevTotalPrice => prevTotalPrice + cokePriceAdjustment - oldPrice);
        setMexicanCokes(newQuantity);
    };


    const handlePayPalButtonClick = () => {
        setPaypalButtonTrigger(true);
        setCart(generateCart());
        //console.log(cart);
    };

    return (

        <div>
            <div className="order-label">
                <h1>Order Now</h1>
            </div>
            <div className="food-cards-container">
                {foodCards.map((foodCard, index) => (
                    <FoodCard
                        key={index}
                        title={foodCard.title}
                        imageUrl={foodCard.imageUrl}
                        hasOnions={foodCard.hasOnions}
                        onOnionsChange={(newHasOnions) => handleOnionsChange(index, newHasOnions)}
                        hasCilantro={foodCard.hasCilantro}
                        onCilantroChange={(newHasCilantro) => handleCilantroChange(index, newHasCilantro)}
                        meatChoice={foodCard.meatChoice}
                        onMeatChoiceChange={(newMeatChoice) => handleMeatChoiceChange(index, newMeatChoice)}
                        hasSameToppings={foodCard.hasSameToppings}
                        onSameToppingsChange={(newHasToppings) => handleSameToppingsChange(index, newHasToppings)}
                        price={foodCard.price}
                        maxQuantity={foodCard.maxQuantity}
                        quantity={foodCard.quantity}
                        onQuantityChange={newQuantity => handleQuantityChange(index, newQuantity)}
                        cardIndex={index} // Pass the cardIndex prop
                    />
                ))}
            </div>
            <div className="total-price">
                {(totalPrice > 0 && !containsItems()) && (
                    <>
                        <label>
                            Salsa Verde:
                            <input type="checkbox" name="salsaVerde" checked={salsaVerde} onChange={handleSalsaVerdeChange}/>
                        </label>
                        <label>
                            Salsa Rojo:
                            <input type="checkbox" name="salsaRojo" checked={salsaRojo} onChange={handleSalsaRojoChange}/>
                        </label>
                        <br/>
                        <label>
                            Mexican Cokes:
                            <select value={mexicanCokes} onChange={handleMexicanCokesChange}>
                                {[...Array(7).keys()].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </label>
                        <br/>
                        <label>
                            Deliver My Food:
                            <input type="checkbox" name="delivery" checked={isDelivery} onChange={handleDeliveryChange} />
                        </label>

                        <p>Total Price: ${totalPrice}</p>
                        <button onClick={handlePayPalButtonClick} className="paypal-button">
                            Generate Checkout
                        </button>
                    </>
                )}
            </div>
            <div className="pay-pal-buttons-home">
                {totalPrice > 0 && paypalButtonTrigger ? <PayPalButtons cart={cart} /> : null}
            </div>
        </div>
    );

};

export default Home;
