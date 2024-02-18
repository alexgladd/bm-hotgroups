import { useEffect, useRef, useState } from "react";
import { BrandmeisterLastHeard } from "@/lib/bmlh";
import { BrandmeisterActivity } from "@/lib/bmacty";
import { isSessionStart, isSessionStop } from "@/lib/session";
import type { TopGroup } from "@/lib/types";
import { aggregateGroups } from "@/lib/bmagg";

export default function useBrandmeister(
  aggWindowSeconds: number = 300,
  updateIntervalSeconds: number = 5,
  connectNow: boolean = false,
) {
  const [connected, setConnected] = useState(connectNow);
  const [started, setStarted] = useState<Date | null>(connectNow ? new Date() : null);
  const [groups, setGroups] = useState<Map<number, TopGroup>>(new Map());
  const bmlh = useRef<BrandmeisterLastHeard | null>(null);
  const bmact = useRef<BrandmeisterActivity | null>(null);

  if (bmact.current === null) {
    bmact.current = new BrandmeisterActivity();
  }

  if (bmlh.current === null) {
    bmlh.current = new BrandmeisterLastHeard();
  }

  useEffect(() => {
    bmlh.current!.onConnectionChange((connected) => setConnected(connected));

    // handle session starts
    bmlh.current!.onMsg(
      (msg) => {
        bmact.current!.handleSessionStart(msg);
      },
      isSessionStart,
      true,
    );

    // handle session stops
    bmlh.current!.onMsg(
      (msg) => {
        bmact.current!.handleSessionStop(msg);
      },
      isSessionStop,
      false,
    );

    // start updates if needed
    let intervalId: NodeJS.Timeout | undefined;
    if (started) {
      const runUpdate = () => {
        bmact.current!.prune();
        const groups = aggregateGroups(bmact.current!.sessions, aggWindowSeconds, started);
        console.log("[BMACT] top groups:", groups);
        setGroups(groups);
      };

      // do an update now...
      runUpdate();

      // ...then start interval updates
      intervalId = setInterval(runUpdate, updateIntervalSeconds * 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      bmlh.current!.dropListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aggWindowSeconds, updateIntervalSeconds, started]);

  return {
    isConnected: connected,
    groups,
    connect: () => {
      bmlh.current!.open();
      setStarted(new Date());
    },
    disconnect: () => {
      bmlh.current!.close();
      setStarted(null);
    },
    clear: () => {
      bmact.current!.clear();
      setGroups(new Map());
      if (connected) setStarted(new Date());
    },
  };
}
