// Brandmeister last heard data aggregator

import _ from 'lodash';
import moment from 'moment';

class BrandmeisterAggregator {
  constructor(windowMins=10, maxWindowMins=60) {
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

  addSession(session) {
    if (session.Event !== 'Session-Stop' || _.has(this.sessions, session.SessionID)) {
      return false;
    }

    this.sessions[session.SessionID] = _.cloneDeep(session);

    // call duration
    const start = moment.unix(session.Start);
    const stop = moment.unix(session.Stop);
    this.sessions[session.SessionID].duration = stop.diff(start, 'seconds');

    return this.reaggregate();
  }

  reaggregate() {
    const now = moment();
    let windowedSessions = _.filter(this.sessions, (session) => {
      return this._windowFilter(now, session);
    });
    windowedSessions = _.orderBy(windowedSessions, ['Start'], ['desc']);

    if (this._didWindowSessionsChange(windowedSessions)) {
      // talk groups
      const talkGroups = _.reduce(windowedSessions, this._talkGroupReducer, {});
      this.talkGroups = _.orderBy(talkGroups, ['talkTime', 'id'], ['desc', 'asc']);

      // callsigns
      // TODO

      console.log('Windowed sessions', windowedSessions)

      return true;
    } else {
      return false;
    }
  }

  prune() {

  }

  _windowFilter(now, session) {
    return now.diff(moment.unix(session.Start), 'minutes') <= this.window;
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
    tg.lastActive = session.Stop
    
    acc[tg.id] = tg;
    return acc;
  }

  _didWindowSessionsChange(newWindowedSessions) {
    if (this.windowedSessions.length === 0 && newWindowedSessions.length === 0) {
      return false;
    } else if (this.windowedSessions.length === 0 && newWindowedSessions.length !== 0) {
      return true;
    } else if (this.windowedSessions.length !== 0 && newWindowedSessions.length === 0) {
      return true;
    } else if (this.windowedSessions.length !== newWindowedSessions.length) {
      return true;
    } else {
      const oldFirst = _.first(this.windowedSessions);
      const oldLast = _.last(this.windowedSessions);
      const newFirst = _.first(newWindowedSessions);
      const newLast = _.last(newWindowedSessions);

      if (oldFirst.SessionID !== newFirst.SessionID || oldLast.SessionID !== newLast.SessionID) {
        return true;
      } else {
        return false;
      }
    }
  }
}

export default BrandmeisterAggregator;
