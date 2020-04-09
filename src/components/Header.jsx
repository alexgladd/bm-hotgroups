import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBroadcastTower, faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import './Header.css';

const propTypes = {
  enabled: PropTypes.bool,
  connected: PropTypes.bool,
  onConnectionClick: PropTypes.func,
};

const defaultProps = {
  enabled: false,
  connected: false,
  onConnectionClick() { return; }
};

export default class Header extends React.Component {
  render() {
    const { enabled, connected, onConnectionClick } = this.props;

    return (
      <header id="Header">
        <h1>
          <FontAwesomeIcon icon={faBroadcastTower} />&nbsp;&nbsp;Brandmeister Top Activity
        </h1>

        <div className="ConnectBtn">
        { enabled ?
          <button className="Button Primary" onClick={onConnectionClick}>
            { connected ? 'Disconnect' : 'Connect' }
          </button> :
          'Connecting...'
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
      </header>
    );
  }
}

 Header.propTypes = propTypes;
 Header.defaultProps = defaultProps;
