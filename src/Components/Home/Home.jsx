import { NavLink } from "react-router";
import styles from './Home.module.css'

function Home () {
    return (
        <div className={styles.container}>
            <div className={`${styles.box} ${styles.column}`}>
                <h2>Black Jack Game</h2>
                <NavLink to="/game" className={styles.button}>Start Game</NavLink>
            </div>
        </div>
    );
}

export default Home;