import { NavLink } from 'react-router';
import styles from './Navigation.module.css'

function Navigation() {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.navLink}>Home</NavLink>
    </nav>
  );
}



export default Navigation;