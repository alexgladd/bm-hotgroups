import React from 'react';
import PropTypes from 'prop-types';
import './MenuButton.css';

const propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const defaultProps = {};

export default function MenuButton({ menuOpen, onClick }) {
  return (
    <div className="MobileMenu">

    </div>
  );
}

MenuButton.propTypes = propTypes;
MenuButton.defaultProps = defaultProps;
