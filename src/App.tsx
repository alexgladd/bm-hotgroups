import { useEffect, useState } from "react";
import useBmlh from "@/hooks/useBmlh";

function App() {
  const [connected, setConnected] = useState(false);
  const [bmlh] = useBmlh();

  const msgFilter = (msg: object) => {
    if (msg.DestinationID === 91 && msg.Event === "Session-Start") {
      return true;
    } else {
      return false;
    }
  };

  const msgHandler = (msg: object) => console.log(msg);

  const onBtnClick = () => {
    if (bmlh.isConnected) {
      bmlh.close();
    } else {
      bmlh.open();
    }
  };

  useEffect(() => {
    bmlh.onConnectionChange((connected) => setConnected(connected));
    bmlh.onMsg(msgHandler, msgFilter);
    // bmlh.open();

    return () => {
      bmlh.dropListeners();
      bmlh.close();
    };
  }, [bmlh]);

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
