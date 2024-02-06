import BrandmeisterLastHeard from "@/lib/bmlh";
import { useRef } from "react";

export default function useBmlh() {
  const bmlh = useRef<BrandmeisterLastHeard | null>(null);

  if (bmlh.current === null) {
    bmlh.current = new BrandmeisterLastHeard();
  }

  return [bmlh.current!];
}
