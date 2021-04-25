import bmagg from './bmagg';

import moment from 'moment';

let agg = new bmagg(1, 2);

const getSessionResults = (id='abcd', stopOffset=30, duration=60, from=3333333, to=100, now=moment()) => ({
  id: `session-1234-${id}`,
  start: now.unix() - (stopOffset + duration),
  localStart: now.unix() - (stopOffset + duration),
  stop: now.unix() - stopOffset,
  localStop: now.unix() - stopOffset,
  duration,
  callsign: {
    id: from,
    callsign: 'SCALL',
    label: 'SCALL',
    name: 'SNAME',
    sessionId: `session-1234-${id}`,
  },
  talkgroup: {
    id: to,
    name: 'TGNAME',
    label: 'TGNAME',
    sessionId: `session-1234-${id}`,
  },
});

beforeEach(() => {
  agg = new bmagg(1, 2);
});

it('rejects empty session results', () => {
  expect(agg.addEndedSessions([])).toEqual(false);
  expect(agg.latestActivity).toHaveLength(0);
});

it('accepts session result in the window', () => {
  const s = getSessionResults();
  expect(agg.addEndedSessions([s])).toEqual(true);
  expect(agg.latestActivity).toHaveLength(1);
});

it('rejects session result outside the window', () => {
  const s = getSessionResults('abcd', 60);
  expect(agg.addEndedSessions([s])).toEqual(false);
  expect(agg.latestActivity).toHaveLength(0);
});

it('rejects duplicate session IDs', () => {
  const s1 = getSessionResults('abcd');
  const s2 = getSessionResults('abcd');
  agg.addEndedSessions([s1]);
  expect(agg.addEndedSessions([s2])).toEqual(false);
  expect(agg.latestActivity).toHaveLength(1);
});

it('adds session stopping on the window edge to latest activity', () => {
  expect(agg.addEndedSessions([getSessionResults('window-edge', 59)])).toEqual(true);
  expect(agg.latestActivity).toHaveLength(1);
});

it('calculates the correct session duration', () => {
  const duration = 25;
  agg.addEndedSessions([getSessionResults('duration', 10, duration)]);
  expect(agg.latestActivity[0].duration).toEqual(duration);
});

it('aggregates talkgroup IDs', () => {
  const s1 = getSessionResults('tg1-agg', 20, 5, 3333333, 1111111);
  const s2 = getSessionResults('tg2-agg', 10, 10, 4444444, 2222222);
  agg.addEndedSessions([s1]);
  agg.addEndedSessions([s2]);
  expect(agg.topTalkGroups).toHaveLength(2);
  expect(agg.topTalkGroups[0].id).toEqual(2222222);
  expect(agg.topTalkGroups[1].id).toEqual(1111111);
});

it('updates talkgroup aggregations correctly', () => {
  const now = moment();
  const s1 = getSessionResults('tg1-update', 40, 5, 111, 333, now);
  const s2 = getSessionResults('tg2-update', 10, 10, 222, 333, now);
  agg.addEndedSessions([s1]);
  agg.addEndedSessions([s2]);
  expect(agg.topTalkGroups).toHaveLength(1);
  expect(agg.topTalkGroups[0].talkTime).toEqual(15);
  expect(agg.topTalkGroups[0].lastActive).toEqual(now.unix() - 10);
});

it('aggregates callsigns', () => {
  const s1 = getSessionResults('cs1-agg', 20, 5, 3333333);
  const s2 = getSessionResults('cs2-agg', 10, 10, 4444444);
  agg.addEndedSessions([s1]);
  agg.addEndedSessions([s2]);
  expect(agg.topCallsigns).toHaveLength(2);
  expect(agg.topCallsigns[0].id).toEqual(4444444);
  expect(agg.topCallsigns[1].id).toEqual(3333333);
});

it('updates callsign aggregations correctly', () => {
  const now = moment();
  const s1 = getSessionResults('cs1-update', 40, 5, 111, 222, now);
  const s2 = getSessionResults('cs2-update', 10, 10, 111, 333, now);
  agg.addEndedSessions([s1]);
  agg.addEndedSessions([s2]);
  expect(agg.topCallsigns).toHaveLength(1);
  expect(agg.topCallsigns[0].talkTime).toEqual(15);
  expect(agg.topCallsigns[0].lastActive).toEqual(now.unix() - 10);
});

it('should clear all aggregations on reset', () => {
  const s1 = getSessionResults('abcd', 30, 5, 111, 222);
  const s2 = getSessionResults('efgh', 20, 5, 333, 444);
  const s3 = getSessionResults('ijkl', 10, 5, 555, 666);
  agg.addEndedSessions([s1, s2, s3]);
  expect(agg.topCallsigns.length).toEqual(3);
  expect(agg.topTalkGroups.length).toEqual(3);

  agg.reset();
  expect(agg.topCallsigns.length).toEqual(0);
  expect(agg.topTalkGroups.length).toEqual(0);
});
