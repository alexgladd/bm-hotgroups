import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBroadcastTower } from '@fortawesome/free-solid-svg-icons'
import './Header.css';

const propTypes = {
  enabled: PropTypes.bool,
  connected: PropTypes.bool
};

const defaultProps = {
  enabled: false,
  connected: false
};

export default class Header extends React.Component {
  render() {
    const { enabled, connected } = this.props;

    return (
      <header id="Header">
        <div className="Title">
          <FontAwesomeIcon icon={faBroadcastTower} /> Brandmeister Activity
        </div>

        <div className="ConnectBtn">
        { enabled ?
          <button className="Button Primary">{ connected ? 'Disconnect' : 'Connect' }</button> :
          'Loading...'
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
