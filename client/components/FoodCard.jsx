import React, { useState} from 'react';
import './FoodCard.css';
import Select from 'react-select';


const FoodCard = ({title, imageUrl, hasCilantro, hasOnions, hasSalsaVerde, hasSalsaRojo, maxQuantity, price, onQuantityChange }) => {
    const [priceCalc, setPriceCalc] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [sameToppings, setSameToppings] = useState(true);
    const [cilantro, setCilantro] = useState(true);
    const [onions, setOnions] = useState(true);
    const [salsaVerde, setSalsaVerde] = useState(true);
    const [salsaRojo, setSalsaRojo] = useState(true);
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

    const handleCilantroChange = (event) => {
        setCilantro(event.target.checked);
    }

    const handleOnionsChange = (event) => {
        setOnions(event.target.checked);
    }

    const handleSalsaVerdeChange = (event) => {
        setSalsaVerde(event.target.checked);
    }

    const handleSalsaRojoChange = (event) => {
        setSalsaRojo(event.target.checked);
    }

    const renderToppings = (index) => (
        <div key={index}>
            <div className="food-toppings">
                {hasCilantro && (
                    <label>
                        Cilantro:
                        <input type="checkbox" name={`cilantro-${index}`} />
                    </label>
                )}
                {hasOnions && (
                    <label>
                        Onions:
                        <input type="checkbox" name={`onions-${index}`} />
                    </label>
                )}
            </div>
            <div className="food-toppings">
                {hasSalsaVerde && (
                    <label>
                        Salsa Verde:
                        <input type="checkbox" name={`salsaVerde-${index}`} />
                    </label>
                )}
                {hasSalsaRojo && (
                    <label>
                        Salsa Rojo:
                        <input type="checkbox" name={`salsaRojo-${index}`} />
                    </label>
                )}
            </div>
            {index < quantity - 1 && <hr />}
        </div>
    );

    return (
        <div className="food-card">
            <h3>{title}</h3>
            <img src={imageUrl} alt={title}/>
            { (sameToppings && quantity != 0) && (
            <div>

                <div className="food-toppings">
                    {hasCilantro && (
                        <label>
                            Cilantro:
                            <input type="checkbox" name="cilantro" checked={cilantro} onChange={handleCilantroChange}/>
                        </label>
                    )}
                    {hasOnions && (
                        <label>
                            Onions:
                            <input type="checkbox" name="onions" checked={onions} onChange={handleOnionsChange}/>
                        </label>
                    )}
                </div>
                <div className="food-toppings">
                    {hasSalsaVerde && (
                        <label>
                            Salsa Verde:
                            <input type="checkbox" name="salsaVerde" checked={salsaVerde} onChange={handleSalsaVerdeChange}/>
                        </label>
                    )}
                    {hasSalsaRojo && (
                        <label>
                            Salsa Rojo:
                            <input type="checkbox" name="salsaRojo" checked={salsaRojo} onChange={handleSalsaRojoChange}/>
                        </label>
                    )}
                </div>
            </div>
            )}
            {(!sameToppings && quantity > 1) && (
                <>
                    {Array.from({ length: quantity }).map((_, index) => renderToppings(index))}
                </>
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