import React, { useState, useRef } from 'react';
import './FoodCard.css';
import Select from 'react-select';


const FoodCard = ({title, imageUrl, hasCilantro, hasOnions, hasSalsaVerde, hasSalsaRojo, maxQuantity, price, onPriceChange }) => {

    const form = useRef();
    const [priceCalc, setPriceCalc] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        time: '',
        quantity: ''
    });

    const quantity = [
        {label: "One", value: "1"},
        {label: "Two", value: "2"},
        {label: "Three", value: "3"},
        {label: "Four", value: "4"},
    ]

    const quantityChange = (selectedOption) => {
        if (!selectedOption) {
            setPriceCalc(0); // Reset priceCalc when quantity is not selected
            onPriceChange(0);
            // Handle the case when selectedOption is null
            setFormData((prevData) => ({
                ...prevData,
                quantity: '',
            }));
            return;
        }

        const { value } = selectedOption;
        const newPriceCalc = parseInt(value) * price;
        setPriceCalc(newPriceCalc);
        onPriceChange(newPriceCalc);
        setFormData((prevData) => ({
            ...prevData,
            quantity: value,
        }));

        //console.log(priceCalc);
        // console.log(formData);
    };
    return (
        <div className="food-card">
            <h3>{title}</h3>
            <img src={imageUrl} alt={title}/>
            <div>
                {hasCilantro && (
                    <label>
                        Cilantro:
                        <input type="checkbox" name="cilantro" />
                    </label>
                )}
                {hasOnions && (
                    <label>
                        Onions:
                        <input type="checkbox" name="onions" />
                    </label>
                )}
            </div>
            <div>
                {hasSalsaVerde && (
                    <label>
                        Salsa Verde:
                        <input type="checkbox" name="salsaVerde" />
                    </label>
                )}
                {hasSalsaRojo && (
                    <label>
                        Salsa Rojo:
                        <input type="checkbox" name="salsaRojo" />
                    </label>
                )}
            </div>
            <Select
                name="quantity"
                isClearable={true}
                placeholder="Select Quantity"
                options={quantity}
                className="contact-select"
                classNamePrefix="select"
                value={quantity.filter(option => formData.quantity.includes(option.value))}
                onChange={quantityChange}
            />
            <p>
                {priceCalc != 0 ? `Price for ${title.toLowerCase()}: $${priceCalc}` : null}
            </p>
        </div>
    );
}

export default FoodCard;