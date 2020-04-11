// Brandmeister last heard data aggregator

import _ from 'lodash';
import moment from 'moment';
import log from './logger';
import { getTalkGroupLabel, getCallsignLabel, getDurationSeconds } from './session';

export default class BrandmeisterAggregator {
  constructor(windowMins=10, maxWindowMins=30) {
    this.window = windowMins;
    this.maxWindow = maxWindowMins;
    this.sessions = {};
    this.windowedSessions = [];
    this.talkGroups = [];
    this.callsigns = [];
  }

  get topTalkGroups() {
    return this.talkGroups;
  }

  get topCallsigns() {
    return this.callsigns;
  }

  get latestActivity() {
    return this.windowedSessions;
  }

  addSession(session) {
    if (session.Event !== 'Session-Stop') {
      log('[BMAGG] Skipping session (not stop)');
      return false;
    } else if (_.has(this.sessions, session.SessionID)) {
      log('[BMAGG] Skipping session (duplicate ID)');
      return false;
    }

    this.sessions[session.SessionID] = _.cloneDeep(session);

    // call duration
    this.sessions[session.SessionID].duration = getDurationSeconds(session);

    if (this._windowFilter(moment(), session)) {
      this.windowedSessions.push(this.sessions[session.SessionID]);
      this.windowedSessions = _.orderBy(this.windowedSessions, ['localStop'], ['desc']);

      log('[BMAGG] Windowed sessions', this.windowedSessions);
      this.reaggregate();
      return true;
    } else {
      return false;
    }
  }

  reaggregate() {
    // talk groups
    const talkGroups = _.reduce(this.windowedSessions, this._talkGroupReducer, {});
    this.talkGroups = _.orderBy(talkGroups, ['talkTime', 'id'], ['desc', 'asc']);

    // callsigns
    const callsigns = _.reduce(this.windowedSessions, this._callsignReducer, {});
    this.callsigns = _.orderBy(callsigns, ['talkTime', 'id'], ['desc', 'asc']);
  }

  prune() {
    const now = moment();

    // prune sessions
    let beforeCount = _.size(this.sessions);
    const prunedSessions = {};
    _.forOwn(this.sessions, (session, id) => {
      if(this._maxWindowFilter(now, session)) {
        prunedSessions[id] = session;
      }
    });
    let afterCount = _.size(prunedSessions);
    log(`[BMAGG] Pruned saved sessions: ${beforeCount} -> ${afterCount}`);

    this.sessions = prunedSessions;

    // prune windowed sessions
    beforeCount = this.windowedSessions.length;
    const prunedWindow = _.filter(this.windowedSessions, (session) => {
      return this._windowFilter(now, session);
    });
    afterCount = prunedWindow.length;
    log(`[BMAGG] Pruned window sessions: ${beforeCount} -> ${afterCount}`);

    this.windowedSessions = prunedWindow;

    if (beforeCount !== afterCount) {
      this.reaggregate();
      return true;
    } else {
      return false;
    }
  }

  _windowFilter(now, session) {
    return now.diff(moment.unix(session.localStop), 'minutes') < this.window;
  }

  _maxWindowFilter(now, session) {
    return now.diff(moment.unix(session.localStop), 'minutes') < this.maxWindow;
  }

  _talkGroupReducer(acc, session) {
    let tg;
    if (_.has(acc, session.DestinationID)) {
      // update existing
      tg = acc[session.DestinationID];
    } else {
      // create new
      tg = {
        id: session.DestinationID,
        name: session.DestinationName,
        label: getTalkGroupLabel(session, true),
        talkTime: 0,
        lastActive: 0
      };
    }

    tg.talkTime = tg.talkTime + session.duration;
    if (session.localStop > tg.lastActive) tg.lastActive = session.localStop;
    
    acc[tg.id] = tg;
    return acc;
  }

  _callsignReducer(acc, session) {
    let cs;
    if (_.has(acc, session.SourceID)) {
      // update existing
      cs = acc[session.SourceID];
    } else {
      // create new
      cs = {
        id: session.SourceID,
        callsign: session.SourceCall,
        label: getCallsignLabel(session, true),
        name: session.SourceName,
        talkTime: 0,
        lastActive: 0
      };
    }

    cs.talkTime = cs.talkTime + session.duration;
    if (session.localStop > cs.lastActive) cs.lastActive = session.localStop;

    acc[cs.id] = cs;
    return acc;
  }
}
