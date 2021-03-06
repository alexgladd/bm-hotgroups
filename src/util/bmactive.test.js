import bmactive from './bmactive';
import moment from 'moment';

let active = new bmactive(2);

const getSession = (event, id='abcd', start=0, stop=0, from=3333333, to=1111111) => ({ 
  DestinationCall: "D1CALL",
  DestinationID: to,
  DestinationName: "DNAME",
  Event: event,
  LinkCall: "L1CALL",
  LinkName: "LNAME",
  SessionID: `session-0123-${id}`,
  SessionType: 7,
  SourceCall: "S1CALL",
  SourceID: from,
  SourceName: "SNAME",
  Start: start,
  localStart: start,
  Stop: stop,
  localStop: stop,
});

const getSessionStart = (id='abcd', startOffset=30, from=3333333, to=1111111, now=moment()) =>
  getSession('Session-Start', id, now.unix() - startOffset, 0, from, to);

const getSessionUpdate = (id='abcd', startOffset=30, duration=20, from=3333333, to=1111111, now=moment()) =>
  getSession('Session-Update', id, now.unix() - startOffset, now.unix() - startOffset + duration, from, to);

const getSessionStop = (id='abcd', startOffset=30, duration=20, from=3333333, to=1111111, now=moment()) =>
  getSession('Session-Stop', id, now.unix() - startOffset, now.unix() - startOffset + duration, from, to);

beforeEach(() => {
  active = new bmactive(2);
});

it('rejects non-start sessions', () => {
  const s1 = getSessionStop();
  const s2 = getSessionUpdate();
  expect(active.addSessionStart(s1)).toEqual(false);
  expect(active.addSessionStart(s2)).toEqual(false);
});

it('accepts start sessions', () => {
  const s = getSessionStart();
  expect(active.addSessionStart(s)).toEqual([]);
});

it('rejects sessions that start outside the window', () => {
  const s = getSessionStart('abcd', 121);
  expect(active.addSessionStart(s)).toEqual(false);
});

it('accepts sessions that start on the window edge', () => {
  const s = getSessionStart('abcd', 120);
  expect(active.addSessionStart(s)).toEqual([]);
});

it('rejects sessions that have been superceded by another', () => {
  const s1 = getSessionStart('abcd', 30);
  const s2 = getSessionStart('efgh', 60);
  active.addSessionStart(s1);
  expect(active.addSessionStart(s2)).toEqual(false);
});

it('rejects sessions with a duplicate session ID', () => {
  const s1 = getSessionStart('abcd', 45);
  const s2 = getSessionStart('abcd', 30);
  active.addSessionStart(s1);
  expect(active.addSessionStart(s2)).toEqual(false);
});

it('invalidates active sessions based on new session starts', () => {
  const s1 = getSessionStart('abcd', 45);
  const s2 = getSessionStart('efgh', 30);

  active.addSessionStart(s1);
  const invalids = active.addSessionStart(s2);

  expect(invalids.length).toEqual(1);
  expect(invalids[0].id).toEqual('session-0123-abcd')
});

it('accepts multiple independent start sessions', () => {
  const s1 = getSessionStart('abcd', 45, 333, 111);
  const s2 = getSessionStart('efgh', 30, 444, 222);
  active.addSessionStart(s1);
  expect(active.addSessionStart(s2)).toEqual([]);
  expect(active.activeSessions.length).toEqual(2);
});

it('rejects non-end sessions', () => {
  const s1 = getSessionStart();
  const s2 = getSessionUpdate('abcd', 10, 5);
  s2.Stop = 0;
  s2.localStop = undefined;
  expect(active.addSessionStop(s1)).toEqual(false);
  expect(active.addSessionStop(s2)).toEqual(false);
});

it('rejects end sessions with unknown session IDs', () => {
  const s1 = getSessionStart('abcd');
  const s2 = getSessionUpdate('efgh');
  const s3 = getSessionStop('efgh');
  active.addSessionStart(s1);
  expect(active.addSessionStop(s2)).toEqual(false);
  expect(active.addSessionStop(s3)).toEqual(false);
});

it('accepts end sessions for known session IDs', () => {
  const s1 = getSessionStart('abcd', 30);
  const s2 = getSessionUpdate('abcd', 30, 10);
  active.addSessionStart(s1);
  const result = active.addSessionStop(s2);
  expect(result.id).toEqual('session-0123-abcd');
  expect(result.duration).toEqual(10);
  expect(active.activeSessions.length).toEqual(0);
});

it('should clear all active sessions on reset', () => {
  const s1 = getSessionStart('abcd', 30, 111, 222);
  const s2 = getSessionStart('efgh', 20, 333, 444);
  const s3 = getSessionStart('ijkl', 10, 555, 666);
  active.addSessionStart(s1);
  active.addSessionStart(s2);
  active.addSessionStart(s3);
  expect(active.activeSessions.length).toEqual(3);

  active.reset();
  expect(active.activeSessions.length).toEqual(0);
});
