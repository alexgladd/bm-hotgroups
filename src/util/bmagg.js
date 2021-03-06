// Brandmeister last heard data aggregator

import _ from 'lodash';
import moment from 'moment';
import log from './logger';

export default class BrandmeisterAggregator {
  constructor(windowMins=5, maxWindowMins=10) {
    this.window = windowMins;
    this.maxWindow = maxWindowMins;
    this.reset();
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

  addEndedSessions(sessions=[]) {
    if (sessions.length < 1) {
      log('[BMAGG] Skipping sessions (empty)');
      return false;
    }

    let updatedAgg = false;

    for (const session of sessions) {
      if (_.has(this.sessions, session.id)) {
        log('[BMAGG] Skipping session (duplicate ID)');
        continue;
      }

      this.sessions[session.id] = session;

      if (this._windowFilter(moment(), session)) {
        updatedAgg = true;
        this.windowedSessions.push(this.sessions[session.id]);
      }
    }

    if (updatedAgg) {
      this.windowedSessions = _.orderBy(this.windowedSessions, ['localStop'], ['desc']);
      // log('[BMAGG] Windowed sessions', this.windowedSessions);
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

  reset() {
    this.sessions = {};
    this.windowedSessions = [];
    this.talkGroups = [];
    this.callsigns = [];
  }

  _windowFilter(now, session) {
    return now.diff(moment.unix(session.localStop), 'minutes') < this.window;
  }

  _maxWindowFilter(now, session) {
    return now.diff(moment.unix(session.localStop), 'minutes') < this.maxWindow;
  }

  _talkGroupReducer(acc, session) {
    let tg;
    if (_.has(acc, session.talkgroup.id)) {
      // update existing
      tg = acc[session.talkgroup.id];
    } else {
      // create new
      tg = {
        ...session.talkgroup,
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
    if (_.has(acc, session.callsign.id)) {
      // update existing
      cs = acc[session.callsign.id];
    } else {
      // create new
      cs = {
        ...session.callsign,
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
