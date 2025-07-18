import deal from "../../Game Logic/dealing";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Game.module.css";

function Game () {
    const location = useLocation();
    const firstRender = useRef(true);
    const [dealerHand, setDealerHand] = useState([]);
    const [hand, setHand] = useState([]);

    // Deal or load saved hands
    useEffect(() => {
        const savedPlayerHand = localStorage.getItem("playerHand");
        const savedDealerHand = localStorage.getItem("dealerHand");

        if (savedPlayerHand && savedDealerHand) {
            setHand(JSON.parse(savedPlayerHand));
            setDealerHand(JSON.parse(savedDealerHand));
        } else {
            const newHand = [deal(0, 51), deal(0, 51)];
            const newDealer = [deal(0, 51), deal(0, 51)];
            setHand(newHand);
            setDealerHand(newDealer);
            localStorage.setItem("playerHand", JSON.stringify(newHand));
            localStorage.setItem("dealerHand", JSON.stringify(newDealer));
        }
    }, []);

    // Save updated player hand
    useEffect(() => {
        if (hand.length > 0) {
            localStorage.setItem("playerHand", JSON.stringify(hand));
        }
    }, [hand]);

    // Cleanup on route change 
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        return () => {
            localStorage.removeItem("playerHand");
            localStorage.removeItem("dealerHand");
        };
    }, [location.pathname]);

    function canSplit() {
        if (hand.length === 2) {
            const rank1 = hand[0].split("_of_")[0];
            const rank2 = hand[1].split("_of_")[0];
            if (rank1 === rank2) {
                return <button className={styles.split}>Split</button>;
            }
        }
        return <button className={styles.split} disabled>Split</button>;
    }

    function hit () {
        const newCard = deal(0, 51);
        setHand(prev => [...prev, newCard]);

        const newDealerCard = deal(0, 51);
        setTimeout(() => {
            setDealerHand(prev => [...prev, newDealerCard])
        }, 500);
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.container}>
                <div className={styles.dealerContainer}>
                    {(dealerHand.length == 2) ? (
                        <>
                            <img src={`/${dealerHand[0]}`} alt="dealers face card" />
                            <img src="/back_of_card.png" alt="back of a playing card" />
                        </>
                    ) : (
                        <>
                            {dealerHand.map((card, index) => ( <img key={index} src={`/${card}`}/> ))}
                        </>
                    )}
                </div>
                <div className={styles.playerContainer}>
                    {hand.map((card, index) => ( <img key={index} src={`/${card}`}/> ))}
                </div>
                <div className={styles.btnContainer}>
                    <button className={styles.hit} onClick={hit}>Hit</button>
                    <button className={styles.stand}>Stand</button>
                    {canSplit()}
                </div>
            </div>
        </div>
    );
}

export default Game;
