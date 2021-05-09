import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import './Controls.css';

const propTypes = {
  aggMins: PropTypes.number.isRequired,
  enabled: PropTypes.bool.isRequired,
  connected: PropTypes.bool.isRequired,
  onConnectionClick: PropTypes.func.isRequired,
  onResetClick: PropTypes.func.isRequired,
};

const defaultProps = {};

export default function Controls({ aggMins, enabled, connected, onConnectionClick, onResetClick }) {
  return (
    <div id="Controls">
      <div className="Connection">
        <div className="ConnectBtn">
        { enabled ?
          <button className="Button Primary" onClick={onConnectionClick}>
            { connected ? 'Disconnect' : 'Connect' }
          </button> :
          <button className="Button Primary">
            Connecting...
          </button>
        }
        </div>

        { connected ?
          <div className="Status On" title="Connected to Brandmeister">
            <FontAwesomeIcon fixedWidth icon={faCheckCircle} />
          </div>
          :
          <div className="Status Off" title="Disconnected from Brandmeister">
            <FontAwesomeIcon fixedWidth icon={faTimesCircle} />
          </div>
        }
      </div>
      <div className="Aggregation">
        <span className="Window Subtext">Aggregating over {aggMins} minutes</span>
        { /* eslint-disable-next-line */ }
        <a href="#" onClick={onResetClick}>Clear</a>
      </div>
    </div>
  );
}

Controls.propTypes = propTypes;
Controls.defaultProps = defaultProps;
