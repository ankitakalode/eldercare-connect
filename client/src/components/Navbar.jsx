import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/caregivers', label: 'Caregivers' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-primary-800">
              ElderCare <span className="text-primary-600">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link to="/admin" className="btn-outline text-sm">Admin Panel</Link>
                ) : (
                  <>
                    <Link to="/booking" className="btn-primary text-sm">Book Now</Link>
                    <Link to="/dashboard" className="btn-outline text-sm">Dashboard</Link>
                  </>
                )}
                <button onClick={logout} className="text-gray-500 hover:text-red-500 text-sm font-medium px-3">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-sm">Login</Link>
                <Link to="/signup" className="btn-primary text-sm">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 text-sm font-medium ${
                  isActive(link.path) ? 'text-primary-600 bg-primary-50' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 px-4 space-y-2">
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="block btn-outline text-center text-sm">Admin Panel</Link>
                  ) : (
                    <>
                      <Link to="/booking" onClick={() => setIsOpen(false)} className="block btn-primary text-center text-sm">Book Now</Link>
                      <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block btn-outline text-center text-sm">Dashboard</Link>
                    </>
                  )}
                  <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-center text-red-500 text-sm py-2">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block btn-outline text-center text-sm">Login</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="block btn-primary text-center text-sm">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
