import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroadcastTower, faInfoCircle, faNewspaper, faCoffee } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import MenuButton from './MenuButton';

const logCtaEvent = (name = '') => {
  console.log('logCtaEvent fired');
  if (process.env.NODE_ENV === 'production') {
    ReactGA.event({ category: 'CTA', action: name })
  }
}

function NavMenu({ isOpen, onMenuClick }) {
  return (
    <nav id="NavMenu" role="navigation" className={isOpen ? 'Open' : undefined}>
      <a href="https://www.brandmeisteractivity.live/"
        className="NavMenuItem"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onMenuClick() || logCtaEvent('About')}>
        <FontAwesomeIcon icon={faInfoCircle} fixedWidth /> About
      </a>
      <a href="https://www.brandmeisteractivity.live/#news"
        className="NavMenuItem"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onMenuClick() || logCtaEvent('News')}>
        <FontAwesomeIcon icon={faNewspaper} fixedWidth /> News
      </a>
      <a href="https://www.brandmeisteractivity.live/#support"
        className="NavMenuItem"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onMenuClick() || logCtaEvent('Support')}>
        <FontAwesomeIcon icon={faCoffee} fixedWidth /> Support
      </a>
    </nav>
  );
}

NavMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onMenuClick: PropTypes.func.isRequired,
};

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
      <NavMenu isOpen={menuOpen} onMenuClick={() => setMenuOpen(!menuOpen)} />
    </header>
  );
}

 Header.propTypes = propTypes;
 Header.defaultProps = defaultProps;
