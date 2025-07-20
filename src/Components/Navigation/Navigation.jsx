import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css'

function Navigation() {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.navLink} 
      onClick={() => {
        localStorage.clear();
      }}>Home</NavLink>
    </nav>
  );
}



export default Navigation;