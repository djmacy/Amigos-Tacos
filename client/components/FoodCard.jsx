import React, { useState} from 'react';
import './FoodCard.css';
import Select from 'react-select';


const FoodCard = ({title, imageUrl, hasCilantro, hasOnions, hasSalsaVerde, hasSalsaRojo, maxQuantity, price, onQuantityChange }) => {
    const [priceCalc, setPriceCalc] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [sameToppings, setSameToppings] = useState(true);

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

    const quantityList = createObjectList(maxQuantity);

    const quantityChange = (selectedOption) => {
        if (!selectedOption) {
            setPriceCalc(0); // Reset priceCalc when quantity is not selected
            const newQuantity = 0;
            setQuantity(newQuantity); // Update quantity state to 0 when not selected
            onQuantityChange(newQuantity); // Pass the new quantity to the parent component
            return;
        }

        const {value} = selectedOption;
        const newQuantity = parseInt(value);
        setQuantity(newQuantity);
        onQuantityChange(newQuantity); // Pass the new quantity to the parent component

        const newPriceCalc = newQuantity * price;
        setPriceCalc(newPriceCalc);
    };

    const handleSameToppingsChange = (event) => {
        setSameToppings(event.target.checked);
    };

    return (
        <div className="food-card">
            <h3>{title}</h3>
            <img src={imageUrl} alt={title}/>
            {(sameToppings) && (
                <div className="food-toppings">
                    {hasCilantro && (
                        <label>
                            Cilantro:
                            <input type="checkbox" name="cilantro"/>
                        </label>
                    )}
                    {hasOnions && (
                        <label>
                            Onions:
                            <input type="checkbox" name="onions"/>
                        </label>
                    )}
                </div>
            )}
            {(sameToppings) && (
                <div className="food-toppings">
                    {hasSalsaVerde && (
                        <label>
                            Salsa Verde:
                            <input type="checkbox" name="salsaVerde"/>
                        </label>
                    )}
                    {hasSalsaRojo && (
                        <label>
                            Salsa Rojo:
                            <input type="checkbox" name="salsaRojo"/>
                        </label>
                    )}
                </div>
            )}
            <Select
                name="quantity"
                isClearable={true}
                placeholder="Select Quantity"
                options={quantityList}
                className="contact-select"
                classNamePrefix="select"
                value={quantityList.find(option => option.value === quantity.toString())}
                onChange={quantityChange}
            />
            <div className="same-toppings">
                {quantity > 1 ?
                    <label>
                        Same toppings:
                        <input type="checkbox" name="same-toppings" checked={sameToppings} onChange={handleSameToppingsChange}/>
                    </label>
                    : null}
            </div>
            <p>
                {priceCalc != 0 ? `Price for ${title.toLowerCase()}: $${priceCalc}` : null}
            </p>
        </div>
    );
}

export default FoodCard;