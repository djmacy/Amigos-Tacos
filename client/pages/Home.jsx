import PayPalButtons from "../PayPalButtons.jsx";
import FoodCard from "../components/FoodCard.jsx";
import {useState} from "react";

const Home = () => {
    const [totalPrice, setTotalPrice] = useState(0); // State to keep track of total price

    // Function to update total price
    const updateTotalPrice = (newPrice) => {
        setTotalPrice(newPrice);
        console.log("Total Price: " + newPrice.toFixed(2).toString());
    };
    return (
        <>
            <FoodCard title="Quesabirrias " hasOnions={true} hasCilantro={true} hasSalsaVerde={true} hasSalsaRojo={true} price="4"  onPriceChange={updateTotalPrice}/>
            <p>Total Price: ${totalPrice}</p>
            {totalPrice > 0 ?  <PayPalButtons/>: null}

        </>
    );
};

export default Home;
