import { useEffect, useState } from "react";
import useBmlh from "@/hooks/useBmlh";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HotGroups from "@/components/HotGroups";

function App() {
  const [connected, setConnected] = useState(false);
  const [bmlh] = useBmlh();

  const msgFilter = (msg: object) => {
    if (msg.DestinationID === 91) {
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
    <>
      <Header />
      <main className="mt-16 mb-12 p-6">
        <HotGroups />
        <section>
          <h1 className="py-2 text-2xl">Brandmeister Top Activity</h1>
          <button
            type="button"
            onClick={onBtnClick}
            className="p-2 bg-primary text-light font-bold"
          >
            {connected ? "Disconnect" : "Connect"}
          </button>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default App;
