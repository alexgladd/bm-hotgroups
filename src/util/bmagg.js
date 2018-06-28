// Brandmeister last heard data aggregator

import _ from 'lodash';
import moment from 'moment';

class BrandmeisterAggregator {
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

  addSession(session) {
    if (session.Event !== 'Session-Stop' || _.has(this.sessions, session.SessionID)) {
      console.log('[BMAGG] Skipping session (not stop or duplicate ID)');
      return false;
    }

    this.sessions[session.SessionID] = _.cloneDeep(session);

    // call duration
    const start = moment.unix(session.Start);
    const stop = moment.unix(session.Stop);
    this.sessions[session.SessionID].duration = stop.diff(start, 'seconds');

    if (this._windowFilter(moment(), session)) {
      this.windowedSessions.push(this.sessions[session.SessionID]);
      this.windowedSessions = _.orderBy(this.windowedSessions, ['Start'], ['desc']);

      console.log('[BMAGG] Windowed sessions', this.windowedSessions);
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
    console.log(`[BMAGG] Pruned saved sessions: ${beforeCount} -> ${afterCount}`);

    this.sessions = prunedSessions;

    // prune windowed sessions
    beforeCount = this.windowedSessions.length;
    const prunedWindow = _.filter(this.windowedSessions, (session) => {
      return this._windowFilter(now, session);
    });
    afterCount = prunedWindow.length;
    console.log(`[BMAGG] Pruned window sessions: ${beforeCount} -> ${afterCount}`);

    this.windowedSessions = prunedWindow;

    if (beforeCount !== afterCount) {
      this.reaggregate();
      return true;
    } else {
      return false;
    }
  }

  _windowFilter(now, session) {
    return now.diff(moment.unix(session.Start), 'minutes') < this.window;
  }

  _maxWindowFilter(now, session) {
    return now.diff(moment.unix(session.Start), 'minutes') < this.maxWindow;
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
        talkTime: 0,
        lastActive: 0
      };
    }

    tg.talkTime = tg.talkTime + session.duration;
    tg.lastActive = session.Stop;
    
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
        name: session.SourceName,
        talkTime: 0,
        lastActive: 0
      };
    }

    cs.talkTime = cs.talkTime + session.duration;
    cs.lastActive = session.Stop;

    acc[cs.id] = cs;
    return acc;
  }
}

export default BrandmeisterAggregator;
