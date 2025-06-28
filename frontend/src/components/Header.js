import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import '../styles.css'

const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          Marketplace
        </Link>
        <nav className="header-nav">
          <Link to="/" className={pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
          <Link to="/products/register" className={pathname === '/products/register' ? 'nav-link active' : 'nav-link'}>New Product</Link>
          {/* Future links can go here: <Link to="/favorites">Favorites</Link> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
