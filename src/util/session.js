// Brandmeister session object utilities

import _ from 'lodash';
import moment from 'moment';

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

export const getActiveSeconds = (obj={localStart:0}, now=moment()) => {
  const start = moment.unix(obj.localStart);

  return now.diff(start, 'seconds');
}

export const formatTime = (unixTime=0, format='ddd h:mm:ss a') => {
  return moment.unix(unixTime).format(format);
}
