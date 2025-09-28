import './BottomNav.css';
import { NavLink } from 'react-router-dom';
import homeIco from '../../assets/Home1.png';
import favIco  from '../../assets/Vector.png';
import dlIco   from '../../assets/Vector1.png';
import profIco from '../../assets/Profile.png';

type Item = { to: string; label: 'Home'|'Favorites'|'Downloads'|'Profile'; icon: string };

const items: Item[] = [
  { to: '/home',      label: 'Home',      icon: homeIco },
  { to: '/favorites', label: 'Favorites', icon: favIco  },
  { to: '/home',      label: 'Downloads', icon: dlIco   }, 
  { to: '/home',      label: 'Profile',   icon: profIco }, 
];

export default function BottomNav() {
  return (
    <nav className="bottomnav" style={{ display: 'flex' }} aria-label="Bottom navigation">
      {items.map((it) => (
        <NavLink
          key={it.label}
          to={it.to}
          end={it.label === 'Home'} 
          className={({ isActive }) => {
         
            const allowActive =
              (it.label === 'Home' && isActive) ||
              (it.label === 'Favorites' && isActive);
            return `bn-item ${it.label.toLowerCase()}${allowActive ? ' active' : ''}`;
          }}
          aria-label={it.label}
          title={it.label}
        >
          <img src={it.icon} alt="" aria-hidden="true" />
          <span className="sr-only">{it.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
