import type { SessionMsg } from "@/lib/types";
import { type FnMsgFilter } from "@/lib/bmlh";

export const isConsumableSession = (session: SessionMsg) => {
  return session.DestinationID === 91 && session.SessionType === 7;
};

export const isSessionStart: FnMsgFilter = (session: SessionMsg) => {
  return isConsumableSession(session) && session.Event === "Session-Start";
};

export const isSessionStop: FnMsgFilter = (session: SessionMsg) => {
  return isConsumableSession(session) && session.Event === "Session-Stop";
};
