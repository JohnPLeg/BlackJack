import deal from "../../Game Logic/dealing";
import { restoreDeck } from "../../Game Logic/cards";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Game.module.css";

function Game () {
    const location = useLocation();
    const [firstRender, setFirstRender] = useState(true);
    const [firstTurn, setFirstTurn] = useState(true);
    const [playerPoints, setPlayerPoints] = useState(0);
    const [dealerPoints, setDealerPoints] = useState(0);
    const [playersTurn, setPlayersTurn] = useState(true);
    const [dealerHand, setDealerHand] = useState([]);
    const [hand, setHand] = useState([]);
    const [winner, setWinner] = useState(false);
    const [result, setResult] = useState("");
    const [gameInitialized, setGameInitialized] = useState(false);

    // Initialize game with first deal
    useEffect(() => {
        if (!gameInitialized) {
            const newHand = [deal(), deal()];
            const newDealer = [deal(), deal()];
            setHand(newHand);
            setDealerHand(newDealer);
            setGameInitialized(true);
        }
    }, [gameInitialized]);


    // updates the current point amounts for dealer and player upon change
    useEffect(() => {
        const pPoints = calcPoints(hand);
        const dPoints = calcPoints(dealerHand);

        setPlayerPoints(pPoints);
        setDealerPoints(dPoints);

    // Only run this blackjack check once at the start
        if (
            hand.length === 2 &&
            dealerHand.length === 2 &&
            firstTurn
        ) {
            if (pPoints === 21 && dPoints === 21) {
                setWinner(true);
                setResult("Push!");
                setPlayersTurn(false);
            } else if (dPoints === 21) {
                setWinner(true);
                setResult("Dealer Wins!");
                setPlayersTurn(false);
            } else if (pPoints === 21) {
                setWinner(true);
                setResult("BlackJack!");
                setPlayersTurn(false);
            }
        }
    }, [hand, dealerHand, firstTurn]);

    // calculates the points with a given hand
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

    // allows the player to hit
    function hit () {
        const newCard = deal();
        const newHand = [...hand, newCard];
        setHand(newHand);

        const pPoints = calcPoints(newHand);
        
        // checks bust or win
        if (pPoints > 21) {
            setWinner(true);
            setResult("Player Bust");
        }

        setPlayerPoints(pPoints);
    }

    // allows the player to stand
    function stand() {
        setPlayersTurn(false);
        setFirstTurn(false);

        // dealer plays until it wins or points >= 17
        function dealerSoloPlay(currentDealerHand) {
            const dPoints = calcPoints(currentDealerHand);
            const pPoints = calcPoints(hand);
            //  hit sub 17
            if (dPoints < 17) {
                const newDealerCard = deal();
                const newDealerHand = [...currentDealerHand, newDealerCard];

                setDealerHand(newDealerHand);

                setTimeout(() => dealerSoloPlay(newDealerHand), 1000);
            } else {
                // game ends and winner is decided
                setWinner(true);
                if (dPoints > 21) {
                    console.log("dealer bust");
                    setResult("Dealer Bust");
                } else if (dPoints === pPoints) {
                    console.log("Push");
                    setResult("Push!");
                } else if (dPoints === 21 || dPoints > pPoints) {
                    console.log("dealer win");
                    setResult("Dealer Wins!");
                } else {
                    console.log("player wins");
                    setResult("Player Wins!");
                }
            }
        }
        setTimeout(() => dealerSoloPlay(dealerHand), 500);
    }

    function resetGame() {
        restoreDeck();  // resets the deck so dealing can start fresh

        setHand([]);
        setDealerHand([]);
        setWinner(false);
        setResult("");
        setPlayersTurn(true);
        setFirstTurn(true);
        setGameInitialized(false);
    }

    

    return (
        <>
            
            {winner ? (
                <h1 className={styles.turn}>{result}</h1> 
            ) : (
                <h1 className={styles.turn}>{(playersTurn) ? "Player" : "Dealer" }'s Turn</h1>
            )}
            <div className={styles.mainContainer}>
                <div className={styles.container}>
                    <div className={styles.dealerContainer}>
                        <h1 className={styles.counter}>{(firstTurn && dealerHand[0]) ? `${calcPoints([dealerHand[0]])} + ?` : dealerPoints}</h1>
                        <div className={styles.cards}>
                            {(firstTurn && !winner) ? (
                                <>
                                    <img src={`/BlackJack/${dealerHand[0]}`} alt="dealers face card" />
                                    <img src="/BlackJack/back_of_card.png" alt="back of a playing card" />
                                </>
                            ) : (
                                <>
                                    {dealerHand.map((card, index) => ( <img key={index} src={`/BlackJack/${card}`}/> ))}
                                </>
                            )}
                        </div>
                    </div>
                    <div className={styles.playerContainer}>
                        <h1 className={styles.counter}>{playerPoints}</h1>
                        <div className={styles.cards}>
                            {hand.map((card, index) => ( <img key={index} src={`/BlackJack/${card}`}/> ))}
                        </div>
                    </div>
                    <div className={styles.btnContainer}>
                        {!winner ? (
                            <>
                                <button className={styles.hit} onClick={hit} disabled={winner || !playersTurn}>Hit</button>
                                <button className={styles.stand} onClick={stand} disabled={winner || !playersTurn}>Stand</button>
                            </>
                        ):(
                            <button className={styles.newGame} onClick={resetGame}>New Game</button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Game;
