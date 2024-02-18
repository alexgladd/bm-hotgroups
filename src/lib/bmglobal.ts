import type { Session } from "@/lib/types";

// global cache of ID-to-Name mappings
const idNames: Map<number, string> = new Map();

export function updateIdMappings(session: Session) {
  if (session.destinationName && !idNames.get(session.destinationId)) {
    idNames.set(session.destinationId, session.destinationName);
  }

  if (session.sourceName && !idNames.get(session.sourceId)) {
    idNames.set(session.sourceId, session.sourceName);
  }
}

export function getName(id: number) {
  return idNames.get(id);
}
