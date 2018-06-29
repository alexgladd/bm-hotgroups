import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import _ from 'lodash';
import './TopCallsigns.css';
import './Filters.css';
import './Tables.css';

const propTypes = {
  callsigns: PropTypes.array.isRequired
};

const defaultProps = {};

export default class TopCallsigns extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewCount: 20
    };
  }

  render() {
    const { callsigns } = this.props;
    const { viewCount } = this.state;

    let topCallsigns = callsigns.map((cs, idx) => (
      <tr key={idx}>
        <td>{ cs.label }</td>
        <td>{ cs.name }</td>
        <td>{ `${cs.talkTime} seconds` }</td>
        <td>{ moment.unix(cs.lastActive).format('ddd h:mm:ssa') }</td>
      </tr>
    )).slice(0, viewCount);

    if (topCallsigns.length < viewCount) {
      topCallsigns = topCallsigns.concat(_.times(viewCount - topCallsigns.length, (idx) => (
        <tr key={topCallsigns.length + idx}>
          <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
        </tr>
      )));
    }

    return (
      <div id="TopCallsigns">
        <h2><FontAwesomeIcon icon={faUser} /> Top Callsigns</h2>

        <div className="Filters">Filters</div>

        <table>
          <thead><tr>
            <th>Callsign</th>
            <th>Name</th>
            <th>Talk Time</th>
            <th>Last Active</th>
          </tr></thead>
          <tbody>
          {
            topCallsigns
          }
          </tbody>
        </table>
      </div>
    );
  }
}

TopCallsigns.propTypes = propTypes;
TopCallsigns.defaultProps = defaultProps;
