import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { HiOutlineSignal } from 'react-icons/hi2';
import CitySelector from './CitySelector';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/prediction', label: 'Prediction' },
  { to: '/map', label: 'Traffic Map' },
  { to: '/route-optimizer', label: 'Route Optimizer' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-primary/40 bg-primary-700/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green text-cream shadow-lg shadow-black/30">
            <HiOutlineSignal className="h-5 w-5" />
          </span>
          <span className="text-[17px] font-bold tracking-tight text-cream">
            TrafficSense <span className="text-cream/80">AI</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <CitySelector />
          <NavLink to="/dashboard" className="btn-primary">
            Open Dashboard
          </NavLink>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <CitySelector />
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary"
            aria-label="Toggle menu"
          >
            {open ? <HiOutlineX className="h-6 w-6" /> : <HiOutlineMenu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-primary/40 bg-primary-700 px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/dashboard" onClick={() => setOpen(false)} className="btn-primary mt-2">
              Open Dashboard
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
