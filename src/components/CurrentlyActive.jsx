import React from 'react';
import PropTypes from 'prop-types';
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
  return (
    <div id="CurrentlyActive" className="Actives">
      <h2><FontAwesomeIcon icon={faMicrophone} /> Currently Active</h2>
      <div className="ActiveItems">
        { sessions.map((s) => (
          <div key={s.id}>
            {s.callsignLabel} &rArr; {s.talkgroupLabel} {`(${getActiveSeconds(s, moment())}s)`}
          </div>
        ))}
      </div>
    </div>
  );
}

CurrentlyActive.propTypes = propTypes;
CurrentlyActive.defaultProps = defaultProps;
