import React from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import FilterBar from './FilterBar';
import Filter from './Filter';
import { hasNameFilter, createNameFilter } from '../util/filters';
import { formatTime } from '../util/session';
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

  componentDidUpdate(prevProps, prevState) {
    // only run this logic in production
    if (process.env.NODE_ENV !== 'production') return;

    const { namedOnly, nameFilter } = this.state;

    if (namedOnly !== prevState.namedOnly) {
      // console.log(`Named Only ${namedOnly}`)
      ReactGA.event({ category: 'Top Groups Filters', action: `Named Only ${namedOnly}` });
    }

    if (!_.isEmpty(nameFilter) && _.isEmpty(prevState.nameFilter)) {
      // console.log('Name filter added')
      ReactGA.event({ category: 'Top Groups Filters', action: 'Name filter added' });
    } else if (_.isEmpty(nameFilter) && !_.isEmpty(prevState.nameFilter)) {
      // console.log('Name filter removed');
      ReactGA.event({ category: 'Top Groups Filters', action: 'Name filter removed' });
    }
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
        <td>{ tg.name } <span className="Subtext">({ tg.id })</span></td>
        <td>{ `${tg.talkTime} seconds` }</td>
        <td>{ formatTime(tg.lastActive) }</td>
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
          <Filter type="checkbox" label="Has group name" state={namedOnly}
            onChange={ (e) => this.setState({ namedOnly: e.target.checked }) } />
          <Filter type="text" label="Group name" state={nameFilter}
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
