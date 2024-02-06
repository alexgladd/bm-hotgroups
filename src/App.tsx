import { useEffect, useRef, useState } from "react";
import BrandmeisterLastHeard from "@/lib/bmlh";

function App() {
  const [connected, setConnected] = useState(false);
  const bmlh = useRef<BrandmeisterLastHeard | null>(null);

  if (bmlh.current === null) {
    bmlh.current = new BrandmeisterLastHeard();
  }

  const msgFilter = (msg: object) => {
    if (msg.DestinationID === 91 && msg.Event === "Session-Start") {
      return true;
    } else {
      return false;
    }
  };

  const msgHandler = (msg: object) => console.log(msg);

  const onBtnClick = () => {
    if (bmlh.current!.isConnected) {
      bmlh.current!.close();
    } else {
      bmlh.current!.open();
    }
  };

  useEffect(() => {
    bmlh.current!.onConnectionChange((connected) => setConnected(connected));
    bmlh.current!.onMsg(msgHandler, msgFilter);
    // bmlh.current!.open();

    return () => {
      bmlh.current!.dropListeners();
      bmlh.current!.close();
    };
  }, []);

  return (
    <main className="p-6">
      <h1 className="py-4 text-2xl">Brandmeister Top Activity</h1>
      <button
        type="button"
        onClick={onBtnClick}
        className="p-2 bg-primary-600 text-white font-bold"
      >
        {connected ? "Disconnect" : "Connect"}
      </button>
    </main>
  );
}

export default App;
