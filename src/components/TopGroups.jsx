import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import './TopGroups.css';
import './Filters.css';
import './Tables.css';

const propTypes = {
  talkGroups: PropTypes.array.isRequired
};

const defaultProps = {};

export default class TopGroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="TopGroups">
        <h2><FontAwesomeIcon icon={faUsers} /> Top Talk Groups</h2>

        <div className="Filters">Filters</div>

        <table>
          <thead><tr>
            <th>Talk Group</th>
            <th>Talk Time</th>
            <th>Last Active</th>
          </tr></thead>
          <tbody>
            <tr><td>TAC310 USA</td><td>123 seconds</td><td>Sat 9:59:12pm</td></tr>
            <tr><td>Worldwide</td><td>73 seconds</td><td>Sat 9:59:34pm</td></tr>
            <tr><td>Skynet</td><td>25 seconds</td><td>Sat 9:59:45pm</td></tr>
          </tbody>
        </table>
      </div>
    );
  }
}

 TopGroups.propTypes = propTypes;
 TopGroups.defaultProps = defaultProps;
