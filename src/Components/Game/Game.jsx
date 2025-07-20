import deal from "../../Game Logic/dealing";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Game.module.css";

function Game () {
    const location = useLocation();
    const firstRender = useRef(true);
    const [playerPoints, setPlayerPoints] = useState(0);
    const [dealerPoints, setDealerPoints] = useState(0);
    const [playersTurn, setPlayersTurn] = useState(true);
    const [dealerHand, setDealerHand] = useState([]);
    const [hand, setHand] = useState([]);
    const [winner, setWinner] = useState(false);
    const [playerWin, setPlayerWin] = useState(false);

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

        if (dealerHand.length > 0) {
            localStorage.setItem("dealerHand", JSON.stringify(dealerHand));
        }
    }, [hand, dealerHand]);

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

        setTimeout(() => {
            setPlayersTurn(false);

            setTimeout(() => {
                const newDealerCard = deal(0, 51);
                setDealerHand(prev => [...prev, newDealerCard]);

                setTimeout(() => {
                    setPlayersTurn(true);
                }, 500);
            }, 1000);
        }, 500);

    }

    useEffect(() => {
        setPlayerPoints(calcPoints(hand));
        setDealerPoints(calcPoints(dealerHand));
    }, [hand, dealerHand])


    function calcPoints(hand) {
        let sum = 0;
        let aces = 0;

        for (let i = 0; i < hand.length; i++) {
            const card = hand[i];
            const rank = card.split("_of_")[0];

            if (["jack", "queen", "king"].includes(rank)) {
                sum += 10;
            } else if (rank === "ace") {
                sum += 11;
                aces += 1;
            } else {
                sum += parseInt(rank);
            }
        }

        while (sum > 21 && aces > 0) {
            sum -= 10;
            aces -= 1;
        }

        return sum;
    }

    function stand() {
        setPlayersTurn(false);

        function dealerSoloPlay(currentDealerHand) {
            const points = calcPoints(currentDealerHand);
            //  hit sub 17  ||  hit above 17 and below 21
            if (points < 17 || (points > 17 && points < 21)) {
                const newDealerCard = deal(0, 51);
                const newDealerHand = [...currentDealerHand, newDealerCard];

                setDealerHand(newDealerHand);

                setTimeout(() => dealerSoloPlay(newDealerHand), 1000);
            } else {
                setWinner(true);
                if (points === 21) {
                    console.log("dealer win");
                    setPlayerWin(false);
                } else {
                    console.log("dealer bust");
                    setPlayerWin(true);
                }
            }
        }
        setTimeout(() => dealerSoloPlay(dealerHand), 500);
    }

    

    return (
        <>
            
            {winner ? (
                <h1 className={styles.turn}>{playerWin ? "Player Wins!" : "Dealer Wins!"}</h1> 
            ) : (
                <h1 className={styles.turn}>{(playersTurn) ? "Player" : "Dealer" }'s Turn</h1>
            )}
            <div className={styles.mainContainer}>
                <div className={styles.container}>
                    <div className={styles.dealerContainer}>
                        <h1 className={styles.counter}>{dealerPoints}</h1>
                        <div className={styles.cards}>
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
                    </div>
                    <div className={styles.playerContainer}>
                        <h1 className={styles.counter}>{playerPoints}</h1>
                        <div className={styles.cards}>
                            {hand.map((card, index) => ( <img key={index} src={`/${card}`}/> ))}
                        </div>
                    </div>
                    <div className={styles.btnContainer}>
                        <button className={styles.hit} onClick={hit}>Hit</button>
                        <button className={styles.stand} onClick={stand}>Stand</button>
                        {canSplit()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Game;
