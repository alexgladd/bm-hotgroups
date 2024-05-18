import { compareAsc, formatDistance } from "date-fns";
import type { IActiveTimes } from "@/lib/types";

export function getLastActive(obj: IActiveTimes, now: Date) {
  if (obj.active) {
    return "now";
  } else if (obj.activeTimes.length === 0) {
    return "-";
  } else {
    let latestStop = obj.activeTimes[0].stop;
    for (let i = 1; i < obj.activeTimes.length; i++) {
      const tStop = obj.activeTimes[i].stop;

      if (!latestStop || (tStop && compareAsc(latestStop, tStop) < 0)) {
        latestStop = tStop;
      }
    }

    if (latestStop) {
      return formatDistance(latestStop, now, { includeSeconds: true, addSuffix: true });
    } else {
      return "now";
    }
  }
}
