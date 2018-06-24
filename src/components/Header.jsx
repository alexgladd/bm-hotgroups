import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBroadcastTower } from '@fortawesome/free-solid-svg-icons'
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
        <div className="Title">
          <FontAwesomeIcon icon={faBroadcastTower} /> Brandmeister Top Activity
        </div>

        <div className="ConnectBtn">
        { enabled ?
          <button className="Button Primary" onClick={onConnectionClick}>
            { connected ? 'Disconnect' : 'Connect' }
          </button> :
          'Connecting...'
        }
        </div>

        { connected ?
          <div className="Label Success">connected</div> :
          <div className="Label Danger">disconnected</div>
        }
      </header>
    );
  }
}

 Header.propTypes = propTypes;
 Header.defaultProps = defaultProps;
