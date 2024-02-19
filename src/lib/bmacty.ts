import { fromUnixTime, differenceInSeconds, subSeconds, compareAsc } from "date-fns";
import { updateIdMappings } from "@/lib/bmglobal";
import type { Session, SessionMsg } from "@/lib/types";

export class BrandmeisterActivity {
  private maxWindowSeconds = 10 * 60;
  private trackedSessions: Map<string, Session>;

  constructor() {
    this.trackedSessions = new Map();
  }

  get sessions() {
    return Array.from(this.trackedSessions.values());
  }

  handleSessionStart(this: BrandmeisterActivity, msg: SessionMsg) {
    // console.log("[BMACT] session start:", msg);
    const existing = this.trackedSessions.get(msg.SessionID);
    if (existing) {
      console.log(`[BMACT] Received session-start event for existing session (${msg.SessionID})!`);
    }

    const session = BrandmeisterActivity.createSession(msg);
    this.trackedSessions.set(session.sessionId, session);
  }

  handleSessionStop(this: BrandmeisterActivity, msg: SessionMsg) {
    // console.log("[BMACT] session stop:", msg);
    const endSession = BrandmeisterActivity.createSession(msg);
    const session = this.trackedSessions.get(endSession.sessionId);

    if (session) {
      // since this is a stop to an existing session, merge it
      BrandmeisterActivity.mergeSessions(session, endSession);
      // then delete it if it turns out to be a zero-duration session
      if (endSession.durationSeconds! === 0) {
        this.trackedSessions.delete(endSession.sessionId);
      }
    } else if (endSession.durationSeconds! !== 0) {
      // if this is a stop for a new session, only add it if it's non-zero duration
      this.trackedSessions.set(endSession.sessionId, endSession);
    }
    // else ignore the session

    // see if we can update any id-to-name mappings
    updateIdMappings(endSession);
  }

  prune(this: BrandmeisterActivity) {
    const oldest = subSeconds(new Date(), this.maxWindowSeconds);
    const deleteIds: string[] = [];

    for (const s of this.trackedSessions.values()) {
      if (s.stop && compareAsc(s.stop, oldest) < 1) {
        deleteIds.push(s.sessionId);
      }
    }

    console.log(`[BMACT] Pruning ${deleteIds.length} sessions`);

    for (const id of deleteIds) {
      this.trackedSessions.delete(id);
    }

    console.log(
      `[BMACT] ${this.trackedSessions.size} sessions:`,
      Array.from(this.trackedSessions.values()),
    );
  }

  clear(this: BrandmeisterActivity) {
    this.trackedSessions.clear();
  }

  private static createSession(msg: SessionMsg) {
    const s: Session = {
      sessionId: msg.SessionID,
      start: fromUnixTime(msg.Start),
      stop: msg.Stop === 0 ? undefined : fromUnixTime(msg.Stop),
      sourceId: msg.SourceID,
      sourceCall: msg.SourceCall.length === 0 ? undefined : msg.SourceCall,
      sourceName: msg.SourceName.length === 0 ? undefined : msg.SourceName,
      talkerAlias: msg.TalkerAlias.length === 0 ? undefined : msg.TalkerAlias,
      destinationId: msg.DestinationID,
      destinationCall: msg.DestinationCall.length === 0 ? undefined : msg.DestinationCall,
      destinationName: msg.DestinationName.length === 0 ? undefined : msg.DestinationName,
    };

    if (s.stop) {
      BrandmeisterActivity.correctClockSkew(s);
      s.durationSeconds = differenceInSeconds(s.stop, s.start);
    }

    return s;
  }

  private static mergeSessions(base: Session, other: Session) {
    if (base.sessionId !== other.sessionId) {
      console.error("[BMACT] Attempting to merge two sessions with different IDs!");
      return;
    }

    // sometimes the network seems to update start times(?)
    base.start = other.start;

    if (other.stop) {
      base.stop = other.stop;
      BrandmeisterActivity.correctClockSkew(base);
      base.durationSeconds = differenceInSeconds(base.stop, base.start);
    }

    if (other.sourceCall) base.sourceCall = other.sourceCall;
    if (other.sourceName) base.sourceName = other.sourceName;
    if (other.talkerAlias) base.talkerAlias = other.talkerAlias;
    if (other.destinationCall) base.destinationCall = other.destinationCall;
    if (other.destinationName) base.destinationName = other.destinationName;
  }

  private static correctClockSkew(session: Session) {
    if (!session.stop) return;

    const now = new Date();
    const fastSeconds = differenceInSeconds(session.stop, now);

    if (fastSeconds > 0) {
      // some clock is running fast; offset session times by the same amount
      console.log(`[BMACT] Session ${session.sessionId} running fast by ${fastSeconds} second(s)!`);
      session.start = subSeconds(session.start, fastSeconds + 1);
      session.stop = subSeconds(session.stop, fastSeconds + 1);
    }
  }
}
