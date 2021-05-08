import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroadcastTower } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import MenuButton from './MenuButton';

function NavMenu({ isOpen }) {
  return (
    <nav id="NavMenu" role="navigation" className={isOpen ? 'Open' : undefined}>
      <a href="https://www.brandmeisteractivity.live/"
        className="NavMenuItem"
        target="_blank"
        rel="noopener noreferrer">
        About
      </a>
      <a href="https://www.brandmeisteractivity.live/#news"
        className="NavMenuItem"
        target="_blank"
        rel="noopener noreferrer">
        News
      </a>
    </nav>
  );
}

const propTypes = {};

const defaultProps = {};

export default function Header() {
  const [ menuOpen, setMenuOpen ] = useState(false);

  return (
    <header id="Header">
      <h1>
        <FontAwesomeIcon icon={faBroadcastTower} />
        <span className="Title">Brandmeister Top Activity</span>
      </h1>
      <MenuButton onClick={() => setMenuOpen(!menuOpen)} />
      <NavMenu isOpen={menuOpen} />
    </header>
  );
}

 Header.propTypes = propTypes;
 Header.defaultProps = defaultProps;
