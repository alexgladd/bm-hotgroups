import {
  areIntervalsOverlapping,
  compareAsc,
  differenceInSeconds,
  subSeconds,
  type Interval,
} from "date-fns";
import { getCall, getName } from "@/lib/bmglobal";
import type { ActiveTime, IActiveTimes, Session, TopGroup, TopTalker } from "@/lib/types";

export function aggregate(sessions: Session[], aggWindowSeconds: number, started: Date) {
  const now = new Date();
  let begin = subSeconds(now, aggWindowSeconds);
  const groups: Map<number, TopGroup> = new Map();
  const talkers: Map<number, TopTalker> = new Map();

  if (compareAsc(begin, started) < 0) {
    begin = started;
  }

  const windowSeconds = differenceInSeconds(now, begin);

  console.log(`[BMAGG] using window seconds ${windowSeconds}`);

  for (const s of sessions) {
    // if the session is completely outside the aggregation window, ignore it
    if (!timesOverlap({ start: begin, stop: now }, s, now)) continue;

    // aggregate on the group
    const groupId = s.destinationId;
    const group = groups.get(groupId);

    if (group) {
      // reaggregate group
      reaggregateTimes(group, s, begin, now, windowSeconds);
      if (!group.name) group.name = getName(group.id);
    } else {
      // create group
      const g = createGroup(s, begin, now, windowSeconds);
      groups.set(g.talkGroup, g);
    }

    // aggregate on the talker
    const talkerId = s.sourceId;
    const talker = talkers.get(talkerId);

    if (talker) {
      // reaggregate talker
      reaggregateTimes(talker, s, begin, now, windowSeconds);
      if (!talker.callsign) talker.callsign = getCall(talker.id);
      if (!talker.name) talker.name = getName(talker.id);
    } else {
      // create talker
      const t = createTalker(s, begin, now, windowSeconds);
      talkers.set(t.id, t);
    }
  }

  return {
    groups,
    talkers,
  };
}

function reaggregateTimes(
  obj: IActiveTimes,
  session: Session,
  begin: Date,
  now: Date,
  windowSeconds: number,
) {
  let start = session.start;
  if (compareAsc(start, begin) < 0) {
    start = begin;
  }

  let timeMerged = false;
  for (const at of obj.activeTimes) {
    if (timesOverlap(at, session, now)) {
      // merge
      mergeTime(at, start, session.stop);
      timeMerged = true;
    }
  }

  if (!timeMerged) {
    obj.activeTimes.push({ start: start, stop: session.stop });
  }

  obj.active = false;

  let activeSeconds = 0;
  for (const at of obj.activeTimes) {
    let duration = at.stop
      ? differenceInSeconds(at.stop, at.start)
      : differenceInSeconds(now, at.start);

    if (duration < 0 || duration > windowSeconds) duration = windowSeconds;

    activeSeconds += duration;

    if (!at.stop) obj.active = true;
  }

  if (activeSeconds > windowSeconds) {
    console.error(
      `[BMAGG] Aggregated active seconds (${activeSeconds}) for object ${obj.id} is greater than current window (${windowSeconds})! This is a bug!`,
    );
    activeSeconds = windowSeconds;
  }

  obj.activeSeconds = activeSeconds;
  obj.activePercent = activeSeconds / windowSeconds;

  return obj;
}

function mergeTime(time: ActiveTime, sStart: Date, sStop?: Date) {
  let start = time.start;
  let stop = time.stop;

  // console.log("[BMAGG] merge time init", { start, stop }, sStart, sStop);

  if (sStart.getTime() < start.getTime()) {
    start = sStart;
  }

  if (stop && sStop && sStop.getTime() > stop.getTime()) {
    stop = sStop;
  } else if (stop && !sStop) {
    stop = undefined;
  }

  time.start = start;
  time.stop = stop;

  // console.log("[BMAGG] merge time result", time);
}

function timesOverlap(time: ActiveTime, session: Session, now: Date) {
  const intTime: Interval = {
    start: time.start,
    end: time.stop ? time.stop : now,
  };

  const intSess: Interval = {
    start: session.start,
    end: session.stop ? session.stop : now,
  };

  return areIntervalsOverlapping(intTime, intSess, { inclusive: true });
}

function getSessionTiming(session: Session, begin: Date, now: Date, windowSeconds: number) {
  let start = session.start;
  if (compareAsc(start, begin) < 0) {
    start = begin;
  }

  let activeSeconds = session.stop
    ? differenceInSeconds(session.stop, start)
    : differenceInSeconds(now, start);

  if (activeSeconds < 0) {
    console.error(
      `[BMAGG] Active seconds for group ${session.destinationId} is less than 0! This is a bug!`,
    );
    activeSeconds = 0;
  }

  if (activeSeconds > windowSeconds) {
    console.error(
      `[BMAGG] Active seconds for session ${session.sessionId} is greater than the current window! This is a bug!`,
    );
    activeSeconds = windowSeconds;
  }

  return {
    start,
    stop: session.stop,
    activeSeconds,
  };
}

function createGroup(session: Session, begin: Date, now: Date, windowSeconds: number) {
  const { start, stop, activeSeconds } = getSessionTiming(session, begin, now, windowSeconds);

  const g: TopGroup = {
    id: session.destinationId,
    talkGroup: session.destinationId,
    name: session.destinationName,
    activeTimes: [{ start, stop }],
    active: stop === undefined,
    activeSeconds,
    activePercent: activeSeconds / windowSeconds,
  };

  return g;
}

function createTalker(session: Session, begin: Date, now: Date, windowSeconds: number) {
  const { start, stop, activeSeconds } = getSessionTiming(session, begin, now, windowSeconds);

  const t: TopTalker = {
    id: session.sourceId,
    callsign: session.sourceCall,
    name: session.sourceName,
    alias: session.talkerAlias,
    activeTimes: [{ start, stop }],
    active: stop === undefined,
    activeSeconds,
    activePercent: activeSeconds / windowSeconds,
  };

  return t;
}
