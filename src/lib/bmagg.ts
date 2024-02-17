import {
  areIntervalsOverlapping,
  compareAsc,
  differenceInSeconds,
  subSeconds,
  type Interval,
} from "date-fns";
import type { Session, TopGroup } from "@/lib/types";

export function aggregateGroups(sessions: Session[], aggWindowSeconds: number, started: Date) {
  const now = new Date();
  let begin = subSeconds(now, aggWindowSeconds);
  const groups: Map<number, TopGroup> = new Map();

  if (compareAsc(begin, started) < 0) {
    begin = started;
  }

  const windowSeconds = differenceInSeconds(now, begin);

  console.log(`[BMAGG] using window seconds ${windowSeconds}`);

  for (const s of sessions) {
    // if the session is completely outside the aggregation window, ignore it
    if (!timesOverlap({ start: begin, stop: now }, s, now)) continue;

    const id = s.destinationId;
    const group = groups.get(id);

    if (group) {
      reaggregateGroup(group, s, begin, now, windowSeconds);
    } else {
      const g = createGroup(s, begin, now, windowSeconds);
      groups.set(g.talkGroup, g);
    }
  }

  return Array.from(groups.values());
}

function reaggregateGroup(
  group: TopGroup,
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
  for (const at of group.activeTimes) {
    if (timesOverlap(at, session, now)) {
      // merge
      mergeTime(at, start, session.stop);
      timeMerged = true;
    }
  }

  if (!timeMerged) {
    group.activeTimes.push({ start: start, stop: session.stop });
  }

  if (session.destinationName) group.name = session.destinationName;

  group.active = false;

  let activeSeconds = 0;
  for (const at of group.activeTimes) {
    let duration = at.stop
      ? differenceInSeconds(at.stop, at.start)
      : differenceInSeconds(now, at.start);

    if (duration < 0 || duration > windowSeconds) duration = windowSeconds;

    activeSeconds += duration;

    if (!at.stop) group.active = true;
  }

  group.activeSeconds = activeSeconds;
  group.activePercent = activeSeconds / windowSeconds;

  // if (compareAsc(group.))
  return group;
}

function mergeTime(time: TopGroup["activeTimes"][0], sStart: Date, sStop?: Date) {
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

function timesOverlap(time: TopGroup["activeTimes"][0], session: Session, now: Date) {
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

function createGroup(session: Session, begin: Date, now: Date, windowSeconds: number) {
  let start = session.start;
  if (compareAsc(start, begin) < 0) {
    start = begin;
  }

  let activeSeconds = session.stop
    ? differenceInSeconds(session.stop, start)
    : differenceInSeconds(now, start);

  if (activeSeconds < 0 || activeSeconds > windowSeconds) activeSeconds = windowSeconds;

  const g: TopGroup = {
    talkGroup: session.destinationId,
    name: session.destinationName,
    activeTimes: [{ start, stop: session.stop }],
    active: session.stop === undefined,
    activeSeconds,
    activePercent: activeSeconds / windowSeconds,
  };

  return g;
}
