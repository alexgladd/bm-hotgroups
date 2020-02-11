// Brandmeister currently active tracker

import _ from 'lodash';
import log from './logger';
import { getTalkGroupLabel, getCallsignLabel } from './session';

export default class BrandmeisterActives {
  constructor() {
    this.reset();
  }

  get activeTalkgroups() {
    return this.talkgroups;
  }

  get activeCallsigns() {
    return this.callsigns;
  }

  addSessionStart(session) {
    if (session.Event !== 'Session-Start') {
      log('[BMACT] Skipping session (not start)');
      return false;
    } else if (_.has(this.sessions, session.SessionID)) {
      log('[BMACT] Skipping session (duplicate ID)');
      return false;
    } else {
      this._addActiveSession(session);
      this._updateActives();
      log('[BMACT] Active sessions', this.sessions);
      log('[BMACT] Active TGs', this.talkgroups);
      log('[BMACT] Active Callsigns', this.callsigns);
      return true;
    }
  }

  addSessionStop(session) {
    if (session.Event !== 'Session-Stop') {
      log('[BMACT] Skipping session (not stop)');
      return false;
    } else if (!_.has(this.sessions, session.SessionID)) {
      log('[BMACT] Skipping session (unknown ID)');
      return false;
    } else {
      this.sessions = _.omit(this.sessions, [session.SessionID]);
      this._updateActives();
      log('[BMACT] Active sessions', this.sessions);
      log('[BMACT] Active TGs', this.talkgroups);
      log('[BMACT] Active Callsigns', this.callsigns);
      return true;
    }
  }

  reset() {
    this.sessions = {};
    this._updateActives();
  }

  _addActiveSession(session) {
    // scan and prune any active sessions that this one invalidates
    const invalids = _.filter(_.values(this.sessions), this._createFilterFunction(session));
    log('[BMACT] Removing invalid sessions', invalids);

    this.sessions = _.omit(this.sessions, _.map(invalids, this._sessionIdMapper));

    this.sessions[session.SessionID] = _.cloneDeep(session);
  }

  _createFilterFunction(session) {
    return (s) => ( s.DestinationID === session.DestinationID || s.SourceID === session.SourceID);
  }

  _sessionIdMapper(session) {
    return session.SessionID;
  }

  _updateActives() {
    const actSessions = _.values(this.sessions);

    this.talkgroups = _.map(actSessions, this._talkgroupMapper);
    this.callsigns = _.map(actSessions, this._callsignMapper);
  }

  _talkgroupMapper(session) {
    return {
      id: session.DestinationID,
      name: session.DestinationName,
      label: getTalkGroupLabel(session),
      localStart: session.localStart
    };
  }

  _callsignMapper(session) {
    return {
      id: session.SourceID,
      callsign: session.SourceCall,
      name: session.SourceName,
      label: getCallsignLabel(session),
      localStart: session.localStart
    };
  }
}
