import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Accueil' },
  { to: '/dashboard', label: 'Tableau de bord' },
  { to: '/focus', label: 'Todo & Pomodoro' },
  { to: '/budget', label: 'Budget' },
  { to: '/vision-board', label: 'Vision Board' },
  { to: '/notes', label: 'Notes' },
  { to: '/habitudes', label: 'Habitudes' },
  { to: '/objectifs', label: 'Objectifs' },
  { to: '/citations', label: 'Citations' },
  { to: '/parametres', label: 'Paramètres' },
]

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__brand">
        MyWorld
      </NavLink>
      <ul className="navbar__list navbar__list--wrap">
        {navItems.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
