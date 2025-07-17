import { Link } from 'react-router-dom';
import styles from './Navigation.module.css'

function Navigation() {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.navLink}>Home</Link>
    </nav>
  );
}



export default Navigation;