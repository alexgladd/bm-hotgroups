export type SessionMsg = {
  SessionID: string;
  Event: "Session-Start" | "Session-Update" | "Session-Stop";
  SessionType: number;
  Start: number;
  Stop: number;
  SourceID: number;
  SourceCall: string;
  SourceName: string;
  TalkerAlias: string;
  DestinationID: number;
  DestinationCall: string;
  DestinationName: string;
};

export type Session = {
  sessionId: string;
  start: Date;
  stop?: Date;
  durationSeconds?: number;
  sourceId: number;
  sourceCall?: string;
  sourceName?: string;
  talkerAlias?: string;
  destinationId: number;
  destinationCall?: string;
  destinationName?: string;
};
