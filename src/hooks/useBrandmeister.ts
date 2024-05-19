import { useEffect, useRef, useState } from "react";
import { BrandmeisterLastHeard } from "@/lib/bmlh";
import { BrandmeisterActivity } from "@/lib/bmacty";
import { isSessionStart, isSessionStop } from "@/lib/session";
import { aggregate } from "@/lib/bmagg";
import type { TopGroup, TopTalker } from "@/lib/types";

export default function useBrandmeister(
  aggWindowSeconds: number = 300,
  updateIntervalSeconds: number = 5,
  connectAtStart: boolean = false,
) {
  const [connected, setConnected] = useState(connectAtStart);
  const [started, setStarted] = useState<Date | null>(connectAtStart ? new Date() : null);
  const [groups, setGroups] = useState<Map<number, TopGroup>>(new Map());
  const [talkers, setTalkers] = useState<Map<number, TopTalker>>(new Map());
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
        const { groups, talkers } = aggregate(bmact.current!.sessions, aggWindowSeconds, started);
        console.log("[BM] top groups:", groups);
        console.log("[BM] top talkers:", talkers);
        setGroups(groups);
        setTalkers(talkers);
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

  // run only at first start to handle auto-connection
  useEffect(() => {
    if (connectAtStart) bmlh.current!.open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isConnected: connected,
    groups,
    talkers,
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
      setTalkers(new Map());
      if (connected) setStarted(new Date());
    },
  };
}
