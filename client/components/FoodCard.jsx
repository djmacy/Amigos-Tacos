import React, {useEffect, useState} from 'react';
import './FoodCard.css';
import Select from 'react-select';

const FoodCard = ({ title, imageUrl, hasCilantro, hasOnions, meatChoice, hasSameToppings, maxQuantity, price, onQuantityChange, onOnionsChange, onCilantroChange, onMeatChoiceChange, onSameToppingsChange, cardIndex }) => {
    const [priceCalc, setPriceCalc] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [sameToppings, setSameToppings] = useState(hasSameToppings);
    const [meatSelections, setMeatSelections] = useState(Array(maxQuantity).fill(meatChoice));
    const [cilantro, setCilantro] = useState(Array(maxQuantity).fill(hasCilantro));
    const [onions, setOnions] = useState(Array(maxQuantity). fill(hasOnions));

    useEffect(() => {
        // Ensure topping handlers are called whenever quantity changes
        if (quantity > 0) {
            if (hasSameToppings) {
                handleCilantroChange(0, { target: { checked: cilantro[0] } });
                handleOnionsChange(0, { target: { checked: onions[0] } });
                handleMeatChange(0, { target:  {
                    value:meatSelections[0],
                    checked: meatSelections[0] === meatSelections[0]
                }});
            } else {
                handleCilantroChange(quantity, {target: { checked:onions[quantity] }});
                handleOnionsChange(quantity, {target: { checked:cilantro[quantity]}});
                handleMeatChange(quantity, {target: {
                    value: meatSelections[quantity],
                    checked: meatSelections[quantity] === meatSelections[quantity]
                }});
            }
        }
    }, [quantity, sameToppings]);

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
            setPriceCalc(0);
            const newQuantity = 0;
            setQuantity(newQuantity);
            onQuantityChange(newQuantity);
            return;
        }

        const { value } = selectedOption;
        const newQuantity = parseInt(value);
        setQuantity(newQuantity);
        onQuantityChange(newQuantity);

        const newPriceCalc = newQuantity * price;
        setPriceCalc(newPriceCalc);

    };

    const handleSameToppingsChange = (event) => {
        const newValue = event.target.checked
        setSameToppings(newValue);
        onSameToppingsChange(newValue);

    };

    const handleCilantroChange = (index, event) => {
        const newCilantro = [...cilantro];
        newCilantro[index] = event.target.checked;
        setCilantro(newCilantro);
        if (hasSameToppings) {
            onCilantroChange(newCilantro[0])
        } else {
            let cilantroArray = [];
            for (let i = 0; i < quantity; i++) {
                cilantroArray.push(newCilantro[i])
            }
            onCilantroChange(cilantroArray);
        }
    }



    const handleOnionsChange = (index, event) => {
        const newOnions = [...onions];
        newOnions[index] = event.target.checked;
        setOnions(newOnions);
        if (hasSameToppings) {
            onOnionsChange(newOnions[0])
        } else {
            let onionsArray = []
            for (let i = 0; i < quantity; i++) {
                onionsArray.push(newOnions[i]);
            }
            onOnionsChange(onionsArray);
        }
    };

    const handleMeatChange = (index, event) => {
        const newMeatSelections = [...meatSelections];
        newMeatSelections[index] = event.target.value;
        setMeatSelections(newMeatSelections);
        if (hasSameToppings) {
            onMeatChoiceChange(newMeatSelections[0]);
        } else {
            let meatArray = [];
            for (let i = 0; i < quantity; i++) {
                meatArray.push(newMeatSelections[i]);
            }
            onMeatChoiceChange(meatArray);
        }
        //console.log(newMeatSelections)
    };

    const renderToppings = (index) => (
        <div key={index}>
            <div className="food-toppings">
                    <label>
                        Cilantro:
                        <input type="checkbox" name={`cilantro-${cardIndex}-${index}`} checked={cilantro[index]} onChange={(event) => handleCilantroChange(index, event)}/>
                    </label>
                    <label>
                        Onions:
                        <input type="checkbox" name={`onions-${cardIndex}-${index}`} checked={onions[index]} onChange={(event) => handleOnionsChange(index, event)} />
                    </label>
            </div>
            <div className="food-toppings">
                <label>Meat:</label>
                <label>
                    <input
                        type="radio"
                        name={`meat-${cardIndex}-${index}`}
                        value="birria"
                        checked={meatSelections[index] === 'birria'}
                        onChange={(event) => handleMeatChange(index, event)}
                    />
                    Birria
                </label>
                <label>
                    <input
                        type="radio"
                        name={`meat-${cardIndex}-${index}`}
                        value="birria-no-cheese"
                        checked={meatSelections[index] === 'birria-no-cheese'}
                        onChange={(event) => handleMeatChange(index, event)}
                    />
                    Birria no cheese
                </label>
                <label>
                    <input
                        type="radio"
                        name={`meat-${cardIndex}-${index}`}
                        value="carne-asada"
                        checked={meatSelections[index] === 'carne-asada'}
                        onChange={(event) => handleMeatChange(index, event)}
                    />
                    Carne Asada
                </label>
            </div>
            {index < quantity - 1 && <hr />}
        </div>
    );

    return (
        <div className="food-card">
            <h3>{title}</h3>
            <img src={imageUrl} alt={title} />
            {sameToppings && quantity !== 0 && (
                <div>
                    <div className="food-toppings">
                            <label>
                                Cilantro:
                                <input type="checkbox" name={`cilantro-${cardIndex}`} checked={cilantro[0]} onChange={(event) => handleCilantroChange(0, event)} />
                            </label>
                            <label>
                                Onions:
                                <input type="checkbox" name={`onions-${cardIndex}`} checked={onions[0]} onChange={(event) => handleOnionsChange(0, event)} />
                            </label>
                    </div>
                    <div className="food-toppings">
                        <label>Meat:</label>
                        <label>
                            <input
                                type="radio"
                                name={`meat-${cardIndex}`}
                                value="birria"
                                checked={meatSelections[0] === 'birria'}
                                onChange={(event) => handleMeatChange(0, event)}
                            />
                            Birria
                        </label>
                        <label>
                            <input
                                type="radio"
                                name={`meat-${cardIndex}`}
                                value="birria-no-cheese"
                                checked={meatSelections[0] === 'birria-no-cheese'}
                                onChange={(event) => handleMeatChange(0, event)}
                            />
                            Birria no cheese
                        </label>
                        <label>
                            <input
                                type="radio"
                                name={`meat-${cardIndex}`}
                                value="carne-asada"
                                checked={meatSelections[0] === 'carne-asada'}
                                onChange={(event) => handleMeatChange(0, event)}
                            />
                            Carne Asada
                        </label>
                    </div>
                </div>
            )}
            {!sameToppings && quantity > 1 && (
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
                        <input type="checkbox" name={`same-toppings-${cardIndex}`} checked={sameToppings} onChange={handleSameToppingsChange} />
                    </label>
                    : null}
            </div>
            <p>
                {priceCalc !== 0 ? `Price for ${title.toLowerCase()}: $${priceCalc}` : null}
            </p>
        </div>
    );
}

export default FoodCard;



/*
    // const [salsaVerde, setSalsaVerde] = useState(true);
    // const [salsaRojo, setSalsaRojo] = useState(true);
    // const handleSalsaVerdeChange = (event) => {
    //     setSalsaVerde(event.target.checked);
    // }
    //
    // const handleSalsaRojoChange = (event) => {
    //     setSalsaRojo(event.target.checked);
    // }

 */

/* <div className="food-toppings">
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
                </div>*/