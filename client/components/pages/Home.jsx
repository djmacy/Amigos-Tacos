import PayPalButtons from "../PayPalButtons.jsx";
import FoodCard from "../FoodCard.jsx";
import React, { useEffect, useState } from "react";
import "./Home.css";
import birriaPicture from "../../images/featured-quesabirria-tacos-recipe.png";
import carneTacoPicture from "../../images/carneAsadaTaco.jpg";
import lokoTacoPicture from "../../images/Quesabirria Web .jpg"
import foodCard from "../FoodCard.jsx";
import Select from "react-select";
import { useNavigate } from 'react-router-dom';
import styles from "../PaymentForm.module.css";

const Home = () => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [cart, setCart] = useState({});
    const [isDelivery, setDelivery] = useState(false);
    const [salsaVerde, setSalsaVerde] = useState(true);
    const [salsaRojo, setSalsaRojo] = useState(true);
    const [customer, setCustomer] = useState({});
    const [mexicanCokes, setMexicanCokes] = useState(0); // State for Mexican Cokes quantity
    const [waters, setWaters] = useState(0); // State for Mexican Cokes quantity
    const [horchata, setHorchata] = useState(0); // State for Mexican Cokes quantity
    const cokePrice = 2;
    const waterPrice = 1;
    const horchataPrice = 2;
    const [inputsDisabled, setInputsDisabled] = useState(false);
    const [formValues, setFormValues] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: ''
    });

    const [foodCards, setFoodCards] = useState([
        { title: "Quesabirrias", imageUrl: birriaPicture, hasOnions: true, hasCilantro: true, meatChoice: 'birria', hasSameToppings: true, price: 4, maxQuantity: 3, quantity: 0 },
        { title: "Loko Taco", imageUrl: lokoTacoPicture, hasOnions: true, hasCilantro: true, meatChoice: 'carne-asada', hasSameToppings: true, price: 3, maxQuantity: 4, quantity: 0 },
        { title: "Carne Asada Taco", imageUrl: carneTacoPicture, hasOnions: true, hasCilantro: true, meatChoice: 'carne-asada', hasSameToppings: true, price: 3, maxQuantity: 4, quantity: 0 }
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
            waters: waters,
            totalPrice: totalPrice.toFixed(2),
            items: items,
            customer: customer


        };

        console.log(orderDetails);
        return orderDetails;
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            [id]: value,
        }));
        setFormValues(prevState => ({
            ...prevState,
            [id]:value
        }))
    };

    const isFormValid = () => {
        return formValues.name && formValues.phone && formValues.email && formValues.address && formValues.city;
    };

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

        if (!event) {
            const newQuantity = 0;
            const oldPrice = mexicanCokes * cokePrice
            const cokePriceAdjustment = 0;
            setTotalPrice(prevTotalPrice => prevTotalPrice + cokePriceAdjustment - oldPrice);
            setMexicanCokes(newQuantity);
            return
        }
        //console.log(event.value);
        const newQuantity = parseInt(event.value);

        const oldPrice = mexicanCokes * cokePrice
        const cokePriceAdjustment = newQuantity * cokePrice;
        setTotalPrice(prevTotalPrice => prevTotalPrice + cokePriceAdjustment - oldPrice);
        setMexicanCokes(newQuantity);
    };

    const handleHorchataChange = (event) => {

        if (!event) {
            const newQuantity = 0;
            const oldPrice = horchata * horchataPrice
            const horchataPriceAdjustment = 0;
            setTotalPrice(prevTotalPrice => prevTotalPrice + horchataPriceAdjustment - oldPrice);
            setHorchata(newQuantity);
            return
        }
        //console.log(event.value);
        const newQuantity = parseInt(event.value);

        const oldPrice = horchata * horchataPrice
        const horchataPriceAdjustment = newQuantity * horchataPrice;
        setTotalPrice(prevTotalPrice => prevTotalPrice + horchataPriceAdjustment - oldPrice);
        setHorchata(newQuantity);
    };

    const handleWaterChange = (event) => {

        if (!event) {
            const newQuantity = 0;
            const oldPrice = waters * waterPrice
            const waterPriceAdjustment = 0;
            setTotalPrice(prevTotalPrice => prevTotalPrice + waterPriceAdjustment - oldPrice);
            setWaters(newQuantity);
            return
        }
        //console.log(event.value);
        const newQuantity = parseInt(event.value);

        const oldPrice = waters * waterPrice
        const waterPriceAdjustment = newQuantity * waterPrice;
        setTotalPrice(prevTotalPrice => prevTotalPrice + waterPriceAdjustment - oldPrice);
        setWaters(newQuantity);
    };


    const handlePayPalButtonClick = () => {
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneValid = phoneRegex.test(formValues.phone);
        const emailValid = emailRegex.test(formValues.email);


        if (phoneValid && emailValid) {
            if (isDelivery) {
                if (formValues.city.toLowerCase() !== "helena") {
                    alert("Sorry we currently only deliver in the Helena area :(");
                } else {
                    setPaypalButtonTrigger(true);
                    setCart(generateCart());
                    setInputsDisabled(true);
                }
            } else {
                setPaypalButtonTrigger(true);
                setCart(generateCart());
                setInputsDisabled(true);
            }

        } else {
            if (!phoneValid) {
                alert("Please enter a valid 9-digit phone number.");
            }
            if (!emailValid) {
                alert("Please enter a valid email address.");
            }
            if (formValues.city.toLowerCase() !== "helena") {
                alert("Sorry we currently only deliver in the Helena area :(");
            }
        }

        //console.log(cart);
    };


    function createObjectList(number) {
        let objectList = [];
        const labels = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
        for (let i = 0; i < number; i++) {
            let obj = {
                label: labels[i],
                value: (i + 1).toString()
            };
            objectList.push(obj);
        }
        return objectList;
    }

    const mexicanCokesQuant = createObjectList(6);

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
                        cardIndex={index}
                        inputsDisabled={inputsDisabled}
                    />
                ))}
            </div>

            <div className="total-price">
                {(totalPrice > 0 && !containsItems()) && (
                    <>
                        <h2 className="detail-label">Drinks</h2>
                        {/*<p className="detail-label">Drinks</p>*/}
                        <div className="info-container">

                            <div className="input-group">
                                <label>Mexican Cokes:</label>
                                <Select
                                    name="coke-quantity"
                                    isClearable={true}
                                    placeholder="Coke"
                                    options={mexicanCokesQuant}
                                    className="contact-select-coke"
                                    classNamePrefix="select"
                                    value={mexicanCokesQuant.find(option => option.value === mexicanCokesQuant.toString())}
                                    onChange={handleMexicanCokesChange}
                                    isDisabled={inputsDisabled}
                                />
                            </div>
                            <div className="input-group">
                                <label>Waters:</label>
                                <Select
                                    name="coke-quantity"
                                    isClearable={true}
                                    placeholder="Water"
                                    options={mexicanCokesQuant}
                                    className="contact-select-coke"
                                    classNamePrefix="select"
                                    value={mexicanCokesQuant.find(option => option.value === mexicanCokesQuant.toString())}
                                    onChange={handleWaterChange}
                                    isDisabled={inputsDisabled}
                                />
                            </div>
                        </div>
                        <h2 className="detail-label">Salsas</h2>
                        {/*<p className="detail-label">Salsas</p>*/}
                        <div className="salsa-container">
                            <div className="checkbox-group">
                                <label>
                                    Salsa Verde:
                                    <input type="checkbox" name="salsaVerde" checked={salsaVerde} onChange={handleSalsaVerdeChange}  disabled={inputsDisabled}/>
                                </label>
                            </div>
                            <div className="checkbox-group">
                                <label>
                                    Salsa Rojo:
                                    <input type="checkbox" name="salsaRojo" checked={salsaRojo} onChange={handleSalsaRojoChange}  disabled={inputsDisabled}/>
                                </label>
                            </div>
                        </div>
                        <h2 className="detail-label">Delivery</h2>
                        {/*<p className="detail-label">Delivery</p>*/}
                        <label>
                            Deliver My Food:
                            <input type="checkbox" name="delivery" checked={isDelivery} onChange={handleDeliveryChange}  disabled={inputsDisabled}/>
                        </label>
                        <h2 className="detail-label">Personal Information</h2>
                        <div className="info-container">

                            <div className="input-group">
                                <label>Preferred Name:</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    className="info-input"
                                    onChange={handleInputChange}
                                    disabled={inputsDisabled}
                                />
                            </div>
                            <div className="input-group">
                                <label>Phone Number:</label>
                                <input
                                    id="phone"
                                    type="text"
                                    placeholder="Phone Number"
                                    className="info-input"
                                    onChange={handleInputChange}
                                    disabled={inputsDisabled}
                                />
                            </div>
                        </div>
                        <div className="info-container">
                            <div className="input-group">
                                <label>Email:</label>
                                <input
                                    id="email"
                                    type="text"
                                    placeholder="Email"
                                    className="info-input"
                                    onChange={handleInputChange}
                                    disabled={inputsDisabled}
                                />
                            </div>
                        </div>
                        <div className="info-container">
                            <div className="input-group">
                                <label>Street Address:</label>
                                <input
                                    id="address"
                                    type="text"
                                    placeholder="Address"
                                    className="info-input"
                                    onChange={handleInputChange}
                                    disabled={inputsDisabled}
                                />
                            </div>
                            <div className="input-group">
                                <label>City:</label>
                                <input
                                    id="city"
                                    type="text"
                                    placeholder="City"
                                    className="info-input"
                                    onChange={handleInputChange}
                                    disabled={inputsDisabled}
                                />
                            </div>
                        </div>


                        <p className="total-price-label">Total Price: ${totalPrice}</p>
                        {isFormValid() &&
                        <button onClick={handlePayPalButtonClick} className="paypal-button" disabled={!isFormValid()}>
                            Generate Checkout
                        </button>
                        }
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
