import React from 'react';
import PropTypes from 'prop-types';
import burgerSvg from './burger-menu.svg';
import './MenuButton.css';


const propTypes = {
  onClick: PropTypes.func.isRequired,
};

const defaultProps = {};

export default function MenuButton({ onClick }) {
  return (
    <button id="MenuBtn" onClick={onClick}>
      <img src={burgerSvg} alt="Hamburger menu icon" />
    </button>
  );
}

MenuButton.propTypes = propTypes;
MenuButton.defaultProps = defaultProps;
