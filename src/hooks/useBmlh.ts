import { useRef } from "react";
import { BrandmeisterLastHeard } from "@/lib/bmlh";
import { BrandmeisterActivity } from "@/lib/bmacty";

export default function useBmlh(): [BrandmeisterLastHeard, BrandmeisterActivity] {
  const bmlh = useRef<BrandmeisterLastHeard | null>(null);
  const bmact = useRef<BrandmeisterActivity | null>(null);

  if (bmact.current === null) {
    bmact.current = new BrandmeisterActivity();
  }

  if (bmlh.current === null) {
    bmlh.current = new BrandmeisterLastHeard();
  }

  return [bmlh.current!, bmact.current!];
}
