import React from 'react';
import PropTypes from 'prop-types';
import './Filters.css';

const propTypes = {
  type: PropTypes.oneOf(['checkbox', 'text']).isRequired,
  label: PropTypes.string.isRequired,
  state: PropTypes.oneOfType([
    PropTypes.string, PropTypes.bool
  ]).isRequired,
  onChange: PropTypes.func.isRequired
};

const defaultProps = {
  onChange(e) { return; }
};

export default class Filter extends React.Component {
  renderCheckbox() {
    const { label, state, onChange } = this.props;
    const id = `cb-${label}`;

    return (
      <React.Fragment>
        <input type="checkbox" id={id} checked={state} onChange={onChange} />
        <label htmlFor={id}>{label}</label>
      </React.Fragment>
    );
  }

  renderTextbox() {
    const { label, state, onChange } = this.props;
    const id = `txt-${label}`;

    return (
      <React.Fragment>
        <label htmlFor={id}>{`${label}: `}</label>
        <input type="text" id={id} placeholder={`Enter ${label}...`} spellCheck="false"
          value={state} onChange={onChange} />
      </React.Fragment>
    );
  }

  render() {
    const { type } = this.props;

    let input;
    switch (type) {
      case 'checkbox':
        input = this.renderCheckbox();
        break;

      case 'text':
        input = this.renderTextbox();
        break;

      default:
        input = "";
    }

    return (
      <div className="Filter">
        { input }
      </div>
    );
  }
}

Filter.propTypes = propTypes;
Filter.defaultProps = defaultProps;
