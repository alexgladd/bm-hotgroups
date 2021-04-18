import React from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { getActiveSeconds } from '../util/session';
import './Actives.css';

const propTypes = {
  sessions: PropTypes.arrayOf(PropTypes.object).isRequired
};

const defaultProps = {};

export default function CurrentlyActive({ sessions }) {
  const now = moment();
  const aSessions = orderBy(
    sessions.map((s) => ({ ...s, activeSeconds: getActiveSeconds(s, now) })),
    ['activeSeconds'], ['desc']);

  return (
    <div id="CurrentlyActive" className="Actives">
      <h2><FontAwesomeIcon icon={faMicrophone} /> Currently Active {`(${sessions.length})`}</h2>
      <div className="ActiveItems">
        { aSessions.map((s) => (
          <div key={s.id}>
            {s.callsignLabel} &rArr; {s.talkgroupLabel} {`(${s.activeSeconds}s)`}
          </div>
        ))}
      </div>
    </div>
  );
}

CurrentlyActive.propTypes = propTypes;
CurrentlyActive.defaultProps = defaultProps;
