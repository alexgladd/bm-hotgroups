import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
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
    const { talkGroups } = this.props;

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
          {
            talkGroups.map((tg, idx) => (
              <tr key={idx}>
                <td>{ `${tg.name} (${tg.id})` }</td>
                <td>{ `${tg.talkTime} seconds` }</td>
                <td>{ moment.unix(tg.lastActive).format('ddd h:mm:ssa') }</td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    );
  }
}

 TopGroups.propTypes = propTypes;
 TopGroups.defaultProps = defaultProps;
