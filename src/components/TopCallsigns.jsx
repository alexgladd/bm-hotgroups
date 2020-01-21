import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import FilterBar from './FilterBar';
import Filter from './Filter';
import { hasNameFilter, createNameFilter, hasCallsignFilter, createCallsignFilter } from '../util/filters';
import { formatTime } from '../util/session';
import './TopCallsigns.css';
import './Tables.css';

const propTypes = {
  callsigns: PropTypes.array.isRequired
};

const defaultProps = {};

export default class TopCallsigns extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewCount: 20,
      namedOnly: false,
      callsignOnly: false,
      nameFilter: '',
      callsignFilter: ''
    };
  }

  render() {
    const { callsigns } = this.props;
    const { viewCount, namedOnly, callsignOnly, nameFilter, callsignFilter } = this.state;

    let filteredCallsigns = callsigns;
    if (callsignOnly) {
      filteredCallsigns = _.filter(filteredCallsigns, hasCallsignFilter);
    }

    if (namedOnly) {
      filteredCallsigns = _.filter(filteredCallsigns, hasNameFilter);
    }

    if (!_.isEmpty(callsignFilter)) {
      filteredCallsigns = _.filter(filteredCallsigns, createCallsignFilter(callsignFilter));
    }
    
    if (!_.isEmpty(nameFilter)) {
      filteredCallsigns = _.filter(filteredCallsigns, createNameFilter(nameFilter));
    }

    let topCallsigns = filteredCallsigns.map((cs, idx) => (
      <tr key={idx}>
        <td>{ cs.label }</td>
        <td>{ cs.name }</td>
        <td>{ `${cs.talkTime} seconds` }</td>
        <td>{ formatTime(cs.lastActive) }</td>
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

        <FilterBar>
          <Filter type="checkbox" label="Has callsign" state={callsignOnly}
            onChange={ (e) => this.setState({ callsignOnly: e.target.checked }) } />
          <Filter type="checkbox" label="Has name" state={namedOnly}
            onChange={ (e) => this.setState({ namedOnly: e.target.checked }) } />
          <Filter type="text" label="Callsign" state={callsignFilter}
            onChange={ (e) => this.setState({ callsignFilter: e.target.value }) } />
          <Filter type="text" label="Name" state={nameFilter}
            onChange={ (e) => this.setState({ nameFilter: e.target.value }) } />
        </FilterBar>

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
