import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import _ from 'lodash';
import FilterBar from './FilterBar';
import Filter from './Filter';
import { hasNameFilter, createNameFilter } from '../util/filters';
import './TopGroups.css';
import './Tables.css';

const propTypes = {
  talkGroups: PropTypes.array.isRequired
};

const defaultProps = {};

export default class TopGroups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewCount: 20,
      namedOnly: false,
      nameFilter: ''
    };
  }

  render() {
    const { talkGroups } = this.props;
    const { namedOnly, nameFilter, viewCount } = this.state;

    let filteredGroups = talkGroups;
    if (namedOnly) {
      filteredGroups = _.filter(filteredGroups, hasNameFilter);
    }

    if (!_.isEmpty(nameFilter)) {
      filteredGroups = _.filter(filteredGroups, createNameFilter(nameFilter));
    }

    let topGroups = filteredGroups.map((tg, idx) => (
      <tr key={idx}>
        <td>{ tg.label }</td>
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
        <h2><FontAwesomeIcon icon={faUsers} /> Top Talkgroups</h2>

        <FilterBar>
          <Filter type="checkbox" label="Has name" state={namedOnly}
            onChange={ (e) => this.setState({ namedOnly: e.target.checked }) } />
          <Filter type="text" label="Name" state={nameFilter}
            onChange={ (e) => this.setState({ nameFilter: e.target.value }) } />
        </FilterBar>

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
