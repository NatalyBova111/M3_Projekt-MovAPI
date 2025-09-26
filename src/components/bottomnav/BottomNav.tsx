import './BottomNav.css';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/home',      label: 'Home',      icon: '/img/Home1.png'    },
  { to: '/favorites', label: 'Favorites', icon: '/img/Vector.png'  },
  { to: '/downloads', label: 'Downloads', icon: '/img/Vector1.png' },
  { to: '/profile',   label: 'Profile',   icon: '/img/Profile.png' },
]

export default function BottomNav() {
  return (
    <nav
      className="bottomnav"
      style={{ display: 'flex' }}          // <= гарантируем flex
      aria-label="Bottom navigation"
    >
      {items.map((it) => {
        // const isHome = it.label === 'Home';
        return (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === '/'}
            className={({ isActive }) =>
              `bn-item ${it.label.toLowerCase()}${isActive ? ' active' : ''}`
            }
            aria-label={it.label}
            title={it.label}
          >


            {/* {isHome && <span className="home-bg" aria-hidden="true" />} */}



            <img src={it.icon} alt="" aria-hidden="true" />
            <span className="sr-only">{it.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
