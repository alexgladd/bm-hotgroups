// Brandmeister currently active tracker

import _ from 'lodash';
import moment from 'moment';
import log from './logger';
import {
  getTalkGroupLabel,
  getCallsignLabel,
  isSessionStart,
  isSessionEnd,
  isSessionTooOld
} from './session';

export default class BrandmeisterActives {
  constructor(maxWindowMins=10) {
    this.maxWindowSeconds = maxWindowMins * 60;
    this.reset();
  }

  get activeSessions() {
    return this.aSessions;
  }

  get activeTalkgroups() {
    return this.talkgroups;
  }

  get activeCallsigns() {
    return this.callsigns;
  }

  addSessionStart(session) {
    if (!isSessionStart(session)) {
      log('[BMACT] Skipping session (not start)');
      return false;
    } else if (isSessionTooOld(session, this.maxWindowSeconds)) {
      log('[BMACT] Skipping session (too old)');
      return false;
    } else if (_.find(_.values(this.sessions), this._createSupercededFunction(session))) {
      log('[BMACT] Skipping session (superceded)');
      return false;
    } else if (_.has(this.sessions, session.SessionID)) {
      log('[BMACT] Skipping session (duplicate ID)');
      return false;
    } else {
      const endResults = this._addActiveSession(session);
      for (const endResult of endResults)
        log(`[BMACT] Ending session ${session.SessionID} TG ${session.DestinationName} after ${endResult.duration} seconds`);
      log(`[BMACT] Starting session ${session.SessionID} TG ${session.DestinationName}`);
      this._updateActives();
      // log(`[BMACT] Active sessions (${this.aSessions.length})`, this.aSessions);
      // log(`[BMACT] Active TGs (${this.talkgroups.length})`, this.talkgroups);
      // log(`[BMACT] Active Callsigns (${this.callsigns.length})`, this.callsigns);
      return endResults;
    }
  }

  addSessionStop(session) {
    if (!isSessionEnd(session)) {
      log('[BMACT] Skipping session (not end)');
      return false;
    } else if (!_.has(this.sessions, session.SessionID)) {
      log('[BMACT] Skipping session (unknown ID)');
      return false;
    } else {
      const endResult = this._endSession(session);
      log(`[BMACT] Ending session ${session.SessionID} TG ${session.DestinationName} after ${endResult.duration} seconds`);
      this._updateActives();
      // log('[BMACT] Active sessions', this.sessions);
      // log('[BMACT] Active TGs', this.talkgroups);
      // log('[BMACT] Active Callsigns', this.callsigns);
      return endResult;
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

    const endResults = invalids.map((is) => this._endSession(is, session));

    this.sessions[session.SessionID] = _.cloneDeep(session);

    return endResults;
  }

  _createSupercededFunction(session) {
    return (s) => (s.DestinationID === session.DestinationID || s.SourceID === session.SourceID) && session.Start <= s.Start;
  }

  _createFilterFunction(session) {
    return (s) => (s.DestinationID === session.DestinationID || s.SourceID === session.SourceID);
  }

  _sessionIdMapper(session) {
    return session.SessionID;
  }

  _updateActives() {
    const actSessions = _.values(this.sessions);

    this.aSessions = _.map(actSessions, this._sessionMapper);
    this.talkgroups = _.map(actSessions, this._talkgroupMapper);
    this.callsigns = _.map(actSessions, this._callsignMapper);
  }

  _endSession(session, stoppedBy=null) {
    const sStop = stoppedBy ? stoppedBy.Start - 1 : session.Stop;
    const sLocalStop = stoppedBy ? moment().unix() : session.localStop;

    // pull out start session
    const sSession = _.find(this.aSessions, (s) => s.id === session.SessionID);
    // pull out tg
    const talkgroup = _.find(this.talkgroups, (tg) => tg.sessionId === session.SessionID);
    // pull out callsign
    const callsign = _.find(this.callsigns, (cs) => cs.sessionId === session.SessionID);

    // clear the session
    this.sessions = _.omit(this.sessions, [session.SessionID]);

    return {
      id: session.SessionID,
      start: sSession.start,
      localStart: sSession.localStart,
      stop: sStop,
      localStop: sLocalStop,
      duration: sStop - sSession.start,
      talkgroup,
      callsign,
    };
  }

  _sessionMapper(session) {
    return {
      id: session.SessionID,
      srcId: session.SourceID,
      dstId: session.DestinationID,
      callsign: session.SourceCall,
      callsignName: session.SourceName,
      callsignLabel: getCallsignLabel(session),
      talkgroup: session.DestinationName,
      talkgroupLabel: getTalkGroupLabel(session),
      start: session.Start,
      localStart: session.localStart,
    };
  }

  _talkgroupMapper(session) {
    return {
      id: session.DestinationID,
      name: session.DestinationName,
      label: getTalkGroupLabel(session),
      sessionId: session.SessionID,
    };
  }

  _callsignMapper(session) {
    return {
      id: session.SourceID,
      callsign: session.SourceCall,
      name: session.SourceName,
      label: getCallsignLabel(session),
      sessionId: session.SessionID,
    };
  }
}
