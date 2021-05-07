import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroadcastTower } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import MenuButton from './MenuButton';

const propTypes = {};

const defaultProps = {};

export default function Header() {
  return (
    <header id="Header">
      <h1>
        <FontAwesomeIcon icon={faBroadcastTower} />
        <span className="Title">Brandmeister Top Activity</span>
      </h1>
      <MenuButton />
    </header>
  );
}

 Header.propTypes = propTypes;
 Header.defaultProps = defaultProps;
