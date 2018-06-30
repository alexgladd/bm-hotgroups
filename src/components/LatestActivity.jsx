import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash';
import { getCallsignLabel, getTalkGroupLabel, getLinkLabel, formatTime } from '../util/session';
import './LatestActivity.css';
import './Filters.css';
import './Tables.css';

const propTypes = {
  sessions: PropTypes.array.isRequired
};

const defaultProps = {};

export default class LatestActivity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewCount: 5
    };
  }

  render() {
    const { sessions } = this.props;
    const { viewCount } = this.state;

    let latestSessions = sessions.map((s, idx) => (
      <tr key={idx}>
        <td>{ `${getCallsignLabel(s)} - ${s.SourceName}` }</td>
        <td>{ getTalkGroupLabel(s) }</td>
        <td>{ formatTime(s.Stop) }</td>
        <td>{ `${s.duration} seconds` }</td>
        <td>{ getLinkLabel(s) }</td>
      </tr>
    )).slice(0, viewCount);

    if (latestSessions.length < viewCount) {
      latestSessions = latestSessions.concat(_.times(viewCount - latestSessions.length, (idx) => (
        <tr key={latestSessions.length + idx}>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
      )));
    }

    return (
      <div id="LatestActivity">
        <h2><FontAwesomeIcon icon={faMicrophone} /> Latest Activity</h2>

        <div className="Filters"></div>

        <table>
          <thead><tr>
            <th>From</th>
            <th>To</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Link</th>
          </tr></thead>
          <tbody>
          {
            latestSessions
          }
          </tbody>
        </table>
      </div>
    );
  }
}

LatestActivity.propTypes = propTypes;
LatestActivity.defaultProps = defaultProps;
