// Brandmeister last heard data aggregator

import _ from 'lodash';
import moment from 'moment';

class BrandmeisterAggregator {
  constructor(windowMins=10, maxWindowMins=60) {
    this.window = windowMins;
    this.maxWindow = maxWindowMins;
    this.sessions = {};
    this.talkGroups = [];
    this.callsigns = [];
  }

  get topTalkGroups() {
    return this.talkGroups;
  }

  addSession(session) {
    if (session.Event !== 'Session-Stop' || _.has(this.sessions, session.SessionID)) {
      return;
    }

    this.sessions[session.SessionID] = _.cloneDeep(session);

    // call duration
    const start = moment.unix(session.Start);
    const stop = moment.unix(session.Stop);
    this.sessions[session.SessionID].duration = stop.diff(start, 'seconds');

    this.reaggregate();
  }

  reaggregate() {
    const now = moment();
    const windowedSessions = _.filter(this.sessions, (session) => {
      return this._windowFilter(now, session);
    });

    console.log('Windowed sessions', windowedSessions)

    // talk groups
    const talkGroups = _.reduce(windowedSessions, this._talkGroupReducer, {});
    this.talkGroups = _.orderBy(talkGroups, ['talkTime', 'id'], ['desc', 'asc']);

    // callsigns
    // TODO
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
}

export default BrandmeisterAggregator;
