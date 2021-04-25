// Brandmeister session object utilities

import _ from 'lodash';
import moment from 'moment';

export const startSessionFilter = (session={DestinationID: 0, SessionType: 0, Event: ''}) => {
  return isConsumableSession(session) && session.Event === 'Session-Start';
}

export const endSessionFilter = (session={DestinationID: 0, SessionType: 0, Event: '', Start: 0, Stop: 0}) => {
  return isConsumableSession(session) && isSessionEnd(session) && getDurationSeconds(session) > 0;
}

export const isConsumableSession = (session={DestinationID: 0, SessionType: 0}) => {
  return session.DestinationID >= 90 && session.SessionType === 7;
}

export const isSessionStart = (session={Event:''}) => {
  return session.Event === 'Session-Start';
}

export const isSessionEnd = (session={Event:'', Stop:0}) => {
  if (session.Event === 'Session-Stop') {
    return true;
  } else if (session.Event === 'Session-Update' && session.Stop > 0) {
    return true;
  } else {
    return false;
  }
}

export const isSessionTooOld = (session={Start: 0}, maxAgeSeconds=600) => {
  const start = moment.unix(session.Start);
  return moment().diff(start, 'seconds') > maxAgeSeconds;
}

export const getTalkGroupLabel = (session={DestinationID:0,DestinationName:'TalkGroup'}, long=false) => {
  if (_.isEmpty(session.DestinationName)) {
    return `${session.DestinationID}`;
  } else if (long) {
    return `${session.DestinationName} (${session.DestinationID})`;
  } else {
    return `${session.DestinationName}`;
  }
}

export const getCallsignLabel = (session={SourceID:0,SourceCall:'Callsign'}, long=false) => {
  if (_.isEmpty(session.SourceCall)) {
    return `${session.SourceID}`;
  } else if (long) {
    return `${session.SourceCall} (${session.SourceID})`;
  } else {
    return `${session.SourceCall}`;
  }
}

export const getLinkLabel = (session={LinkName:'LinkName',LinkCall:'LinkCall'}) => {
  return `${session.LinkName} (${session.LinkCall})`;
}

export const getDurationSeconds = (session={Start:0,Stop:0}) => {
  const start = moment.unix(session.Start);
  const stop = moment.unix(session.Stop);

  return stop.diff(start, 'seconds');
}

export const getActiveSeconds = (obj={start:0}, now=moment()) => {
  const start = moment.unix(obj.start);

  return now.diff(start, 'seconds');
}

export const getActiveTime = (obj={start:0}, now=moment()) => {
  const start = moment.unix(obj.start);
  const seconds = now.diff(start, 'seconds');
  const minutes = now.diff(start, 'minutes');

  if (minutes > 1) {
    return `${minutes}mins ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}min ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

export const formatTime = (unixTime=0, format='ddd h:mm:ss a') => {
  return moment.unix(unixTime).format(format);
}
