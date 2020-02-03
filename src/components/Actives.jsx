import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
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
    { groups.map(tg => <div>{ tg.name }</div>) }
  </Actives>
)

export const ActiveCallsigns = ({ callsigns }) => (
  <Actives name="Callsigns" icon={faUser} id="ActiveCallsigns">
    { callsigns.map(c => <div>{ c.callsign }</div>) }
  </Actives>
)
