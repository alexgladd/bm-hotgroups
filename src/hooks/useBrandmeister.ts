import { useEffect, useRef, useState } from "react";
import { BrandmeisterLastHeard } from "@/lib/bmlh";
import { BrandmeisterActivity } from "@/lib/bmacty";
import { isSessionStart, isSessionStop } from "@/lib/session";

export default function useBrandmeister(
  aggWindowSeconds: number = 300,
  updateIntervalSeconds: number = 5,
  connectNow: boolean = false,
) {
  const [connected, setConnected] = useState(connectNow);
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

    // start updates
    const intervalId = setInterval(() => {
      bmact.current!.prune();
    }, updateIntervalSeconds * 1000);

    return () => {
      clearInterval(intervalId);
      bmlh.current!.dropListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aggWindowSeconds, updateIntervalSeconds]);

  return {
    isConnected: connected,
    connect: () => {
      bmlh.current!.open();
    },
    disconnect: () => {
      bmlh.current!.close();
    },
    clear: () => {
      bmact.current!.clear();
    },
  };
}
