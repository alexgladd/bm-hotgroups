import React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import { getActiveSeconds } from '../util/session';
import './Actives.css';

const Actives = ({ name, icon, id, children }) => (
  <div id={id} className="Actives">
    <h2><FontAwesomeIcon icon={icon} /> { `Active ${name}` }</h2>
    <div className="ActiveItems">
      { children }
    </div>
  </div>
)

export const ActiveGroups = ({ groups }) => (
  <Actives name="Talkgroups" icon={faUsers} id="ActiveGroups">
    { groups.map(tg => <div>{ `${tg.label} (${getActiveSeconds(tg, moment())}s)` }</div>) }
  </Actives>
)

export const ActiveCallsigns = ({ callsigns }) => (
  <Actives name="Callsigns" icon={faUser} id="ActiveCallsigns">
    { callsigns.map(c => <div>{ `${c.label} (${getActiveSeconds(c, moment())}s)` }</div>) }
  </Actives>
)
