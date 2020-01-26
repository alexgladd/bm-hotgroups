import React from 'react';
import PropTypes from 'prop-types';
import './Filters.css';

const propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired
};

const defaultProps = {};

export default class FilterBar extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div className="Filters">
        { children }
      </div>
    );
  }
}

 FilterBar.propTypes = propTypes;
 FilterBar.defaultProps = defaultProps;
