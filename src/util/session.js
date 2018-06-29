// Brandmeister session object utilities

import moment from 'moment';

export const getTalkGroupLabel = (session={DestinationID:0,DestinationName:'TalkGroup'}) => {
  return `${session.DestinationName} (${session.DestinationID})`;
}

export const getCallsignLabel = (session={SourceID:0,SourceCall:'Callsign'}) => {
  return `${session.SourceCall} (${session.SourceID})`;
}

export const getDurationSeconds = (session={Start:0,Stop:0}) => {
  const start = moment.unix(session.Start);
  const stop = moment.unix(session.Stop);

  return stop.diff(start, 'seconds');
}
