import React from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { getActiveSeconds, getActiveTime } from '../util/session';
import './Actives.css';
import './Tables.css';

const propTypes = {
  sessions: PropTypes.arrayOf(PropTypes.object).isRequired
};

const defaultProps = {};

export default function CurrentlyActive({ sessions }) {
  const now = moment();
  const aSessions = orderBy(
    sessions.map((s) => ({ ...s, activeSeconds: getActiveSeconds(s, now), activeTime: getActiveTime(s, now) })),
    ['activeSeconds'], ['desc']);

  return (
    <div id="CurrentlyActive" className="Actives">
      <h2><FontAwesomeIcon icon={faMicrophone} /> Currently Active {`(${sessions.length})`}</h2>
      <div className="ActiveItems">
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {
              aSessions.map((s) => (
                <tr key={s.id}>
                  <td>{s.callsignLabel}</td>
                  <td>{s.talkgroupLabel}</td>
                  <td>{s.activeTime}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

CurrentlyActive.propTypes = propTypes;
CurrentlyActive.defaultProps = defaultProps;
