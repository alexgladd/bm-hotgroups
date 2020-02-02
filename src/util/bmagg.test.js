import bmagg from './bmagg';

import moment from 'moment';

let agg = new bmagg(1, 2);

const getSession = (id='abcd', stopOffset=30, duration=60, now=moment()) => {
  return { 
    DestinationCall: "D1CALL",
    DestinationID: 1111111,
    DestinationName: "DNAME",
    Event: "Session-Stop",
    LinkCall: "L1CALL",
    LinkName: "LNAME",
    SessionID: `session-0123-${id}`,
    SessionType: 7,
    SourceCall: "S1CALL",
    SourceID: 3333333,
    SourceName: "SNAME",
    Start: now.unix() - (stopOffset + duration),
    Stop: now.unix() - stopOffset,
    localStop: now.unix() - stopOffset
  };
}

beforeEach(() => {
  agg = new bmagg(1, 2);
});

it('accepts Session-Stop events in the window', () => {
  const s = getSession();
  expect(agg.addSession(s)).toEqual(true);
  expect(agg.latestActivity).toHaveLength(1);
});

it('rejects non-Session-Stop events in the window', () => {
  const s = getSession();
  s.Event = 'Session-Start';
  expect(agg.addSession(s)).toEqual(false);
  expect(agg.latestActivity).toHaveLength(0);
});

it('rejects duplicate session IDs', () => {
  const s1 = getSession('abcd');
  const s2 = getSession('abcd');
  agg.addSession(s1);
  expect(agg.addSession(s2)).toEqual(false);
  expect(agg.latestActivity).toHaveLength(1);
});

it('adds session stopping on the window edge to latest activity', () => {
  expect(agg.addSession(getSession('window-edge', 59))).toEqual(true);
  expect(agg.latestActivity).toHaveLength(1);
});

it("doesn't add sessions stopping outside the window to latest activity", () => {
  expect(agg.addSession(getSession('window-outside', 60))).toEqual(false);
  expect(agg.latestActivity).toHaveLength(0);
});

it('calculates the correct session duration', () => {
  const duration = 25;
  agg.addSession(getSession('duration', 10, duration));
  expect(agg.latestActivity[0].duration).toEqual(duration);
});

it('aggregates talkgroup IDs', () => {
  const s1 = getSession('tg1-agg', 20, 5); s1.DestinationID = 1111111;
  const s2 = getSession('tg2-agg', 10, 10); s2.DestinationID = 2222222;
  agg.addSession(s1);
  agg.addSession(s2);
  expect(agg.topTalkGroups).toHaveLength(2);
  expect(agg.topTalkGroups[0].id).toEqual(2222222);
  expect(agg.topTalkGroups[1].id).toEqual(1111111);
});

it('updates talkgroup aggregations correctly', () => {
  const now = moment();
  const s1 = getSession('tg1-update', 40, 5, now);
  const s2 = getSession('tg2-update', 10, 10, now);
  agg.addSession(s1);
  agg.addSession(s2);
  expect(agg.topTalkGroups).toHaveLength(1);
  expect(agg.topTalkGroups[0].talkTime).toEqual(15);
  expect(agg.topTalkGroups[0].lastActive).toEqual(now.unix() - 10);
});

it('aggregates callsigns', () => {
  const s1 = getSession('cs1-agg', 20, 5); s1.SourceID = 3333333;
  const s2 = getSession('cs2-agg', 10, 10); s2.SourceID = 4444444;
  agg.addSession(s1);
  agg.addSession(s2);
  expect(agg.topCallsigns).toHaveLength(2);
  expect(agg.topCallsigns[0].id).toEqual(4444444);
  expect(agg.topCallsigns[1].id).toEqual(3333333);
});

it('updates callsign aggregations correctly', () => {
  const now = moment();
  const s1 = getSession('cs1-update', 40, 5, now);
  const s2 = getSession('cs2-update', 10, 10, now);
  agg.addSession(s1);
  agg.addSession(s2);
  expect(agg.topCallsigns).toHaveLength(1);
  expect(agg.topCallsigns[0].talkTime).toEqual(15);
  expect(agg.topCallsigns[0].lastActive).toEqual(now.unix() - 10);
});
