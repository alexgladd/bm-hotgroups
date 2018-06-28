import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import _ from 'lodash';
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

    this.state = {
      viewCount: 20
    };
  }

  render() {
    const { talkGroups } = this.props;
    const { viewCount } = this.state;

    let topGroups = talkGroups.map((tg, idx) => (
      <tr key={idx}>
        <td>{ `${tg.name} (${tg.id})` }</td>
        <td>{ `${tg.talkTime} seconds` }</td>
        <td>{ moment.unix(tg.lastActive).format('ddd h:mm:ssa') }</td>
      </tr>
    )).slice(0, viewCount);

    if (topGroups.length < viewCount) {
      topGroups = topGroups.concat(_.times(viewCount - topGroups.length, (idx) => (
        <tr key={topGroups.length + idx}>
          <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
        </tr>
      )));
    }

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
            topGroups
          }
          </tbody>
        </table>
      </div>
    );
  }
}

 TopGroups.propTypes = propTypes;
 TopGroups.defaultProps = defaultProps;
