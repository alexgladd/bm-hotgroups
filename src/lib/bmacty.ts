import { fromUnixTime, differenceInSeconds, subSeconds, compareAsc } from "date-fns";
import type { Session, SessionMsg } from "@/lib/types";

export class BrandmeisterActivity {
  private maxWindowSeconds = 10 * 60;
  private sessions: Map<string, Session>;

  constructor() {
    this.sessions = new Map();
  }

  handleSessionStart(this: BrandmeisterActivity, msg: SessionMsg) {
    console.log("[BMACT] session start:", msg);
    const existing = this.sessions.get(msg.SessionID);
    if (existing) {
      console.log(`[BMACT] Received session-start event for existing session (${msg.SessionID})!`);
    }

    const session = BrandmeisterActivity.createSession(msg);
    this.sessions.set(session.sessionId, session);
  }

  handleSessionStop(this: BrandmeisterActivity, msg: SessionMsg) {
    console.log("[BMACT] session stop:", msg);
    const endSession = BrandmeisterActivity.createSession(msg);
    const session = this.sessions.get(endSession.sessionId);

    if (session) {
      // if this is a stop to an existing session, merge it
      BrandmeisterActivity.mergeSessions(session, endSession);
      // then delete it if it turns out to be a zero-duration session
      if (endSession.durationSeconds! === 0) {
        this.sessions.delete(endSession.sessionId);
      }
    } else if (endSession.durationSeconds! !== 0) {
      // if this is a stop for a new session, only add it if it's non-zero duration
      this.sessions.set(endSession.sessionId, endSession);
    }
    // else ignore the session

    console.log(`[BMACT] ${this.sessions.size} sessions:`, Array.from(this.sessions.values()));
  }

  prune(this: BrandmeisterActivity) {
    const oldest = subSeconds(Date.now(), this.maxWindowSeconds);
    const deleteIds: string[] = [];

    for (const s of this.sessions.values()) {
      if (s.stop && compareAsc(s.stop, oldest) < 1) {
        deleteIds.push(s.sessionId);
      }
    }

    console.log(`[BMACT] Pruning ${deleteIds.length} sessions`);

    for (const id of deleteIds) {
      this.sessions.delete(id);
    }
  }

  clear(this: BrandmeisterActivity) {
    this.sessions.clear();
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
      s.durationSeconds = msg.Stop - msg.Start;
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
      base.durationSeconds = differenceInSeconds(base.stop, base.start);
    }

    if (other.sourceCall) base.sourceCall = other.sourceCall;
    if (other.sourceName) base.sourceName = other.sourceName;
    if (other.talkerAlias) base.talkerAlias = other.talkerAlias;
    if (other.destinationCall) base.destinationCall = other.destinationCall;
    if (other.destinationName) base.destinationName = other.destinationName;
  }
}
