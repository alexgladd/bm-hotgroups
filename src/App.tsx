import { useState } from "react";
import type { Key } from "react-aria-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faLinkSlash } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import HotGroups from "@/components/HotGroups";
import useBrandmeister from "@/hooks/useBrandmeister";
import { Item, Select } from "@/components/Select";
import { twJoin } from "tailwind-merge";

const aggWindows = [
  { id: 60, name: "1 minute" },
  { id: 120, name: "2 minutes" },
  { id: 300, name: "5 minutes" },
  { id: 600, name: "10 minutes" },
];

function App() {
  const [aggSeconds, setAggSeconds] = useState<Key>(aggWindows[2].id);
  const brandmeister = useBrandmeister(aggSeconds.valueOf() as number, 5, false);

  const onConnectionClick = () => {
    if (brandmeister.isConnected) {
      brandmeister.disconnect();
    } else {
      brandmeister.connect();
    }
  };

  return (
    <>
      <Header />
      <main className="mt-16 mb-12 p-6">
        <section className="mb-2 flex flex-wrap gap-4 justify-center sm:justify-between items-baseline">
          <div className="flex items-baseline gap-2 text-accent text-sm">
            <p>Aggregating over</p>
            <Select
              items={aggWindows}
              selectedKey={aggSeconds}
              onSelectionChange={(selected) => setAggSeconds(selected)}
            >
              {(item) => <Item className="text-sm">{item.name}</Item>}
            </Select>
            <Button secondary onPress={() => brandmeister.clear()}>
              Clear
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              secondary={brandmeister.isConnected}
              onPress={onConnectionClick}
              className="text-sm"
            >
              {brandmeister.isConnected ? "Disconnect" : "Connect"}
            </Button>
            <div
              className={twJoin(
                "flex justify-center items-center aspect-square h-9 rounded-sm text-xl text-light",
                brandmeister.isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-300",
              )}
              title={
                brandmeister.isConnected
                  ? "Connected to the Brandmeister network"
                  : "Not connected to the Brandmeister network"
              }
            >
              <FontAwesomeIcon fixedWidth icon={brandmeister.isConnected ? faLink : faLinkSlash} />
            </div>
          </div>
        </section>
        <HotGroups />
      </main>
      <Footer />
    </>
  );
}

export default App;
