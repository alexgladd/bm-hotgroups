import type { Session } from "@/lib/types";

// global cache of ID-to-Name mappings
const idNames: Map<number, string> = new Map();
// global cache of ID-to-Call mappings
const idCalls: Map<number, string> = new Map();

export function updateIdMappings(session: Session) {
  if (session.destinationName && !idNames.get(session.destinationId)) {
    idNames.set(session.destinationId, session.destinationName);
  }

  if (session.sourceName && !idNames.get(session.sourceId)) {
    idNames.set(session.sourceId, session.sourceName);
  }

  if (session.destinationCall && !idCalls.get(session.destinationId)) {
    idCalls.set(session.destinationId, session.destinationCall);
  }

  if (session.sourceCall && !idCalls.get(session.sourceId)) {
    idCalls.set(session.sourceId, session.sourceCall);
  }
}

export function getName(id: number) {
  return idNames.get(id);
}

export function getCall(id: number) {
  return idCalls.get(id);
}
