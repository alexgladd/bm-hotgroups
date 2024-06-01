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
import TopGroups from "@/components/TopGroups";
import TopTalkers from "@/components/TopTalkers";
import ModalDialog from "@/components/ModalDialog";

const aggWindows = [
  { id: 60, name: "1 minute" },
  { id: 120, name: "2 minutes" },
  { id: 300, name: "5 minutes" },
  { id: 600, name: "10 minutes" },
];

// TODO re-enable connect at start for full release
const connectAtStart = import.meta.env.PROD;

function App() {
  const [modalOpen, setModalOpen] = useState(true);
  const [aggSeconds, setAggSeconds] = useState<Key>(aggWindows[2].id);
  const brandmeister = useBrandmeister(aggSeconds.valueOf() as number, 2, false);

  const onConnectionClick = () => {
    if (brandmeister.isConnected) {
      brandmeister.disconnect();
    } else {
      brandmeister.connect();
    }
  };

  const onModalDismiss = () => {
    if (connectAtStart) brandmeister.connect();
    setModalOpen(false);
  };

  return (
    <>
      <Header />
      <main className="mt-14 mb-12 p-4 md:p-6">
        <section className="mb-2 flex flex-wrap gap-4 justify-center sm:justify-between items-baseline">
          <div className="flex items-baseline gap-2 text-accent text-sm">
            <p className="flex-shrink-0">Aggregating over</p>
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
        <HotGroups groups={brandmeister.groups} />
        <div className="flex flex-col lg:flex-row lg:gap-6">
          <TopGroups groups={Array.from(brandmeister.groups.values())} />
          <TopTalkers talkers={Array.from(brandmeister.talkers.values())} />
        </div>
      </main>
      <Footer />

      <ModalDialog
        isDismissable
        isOpen={modalOpen}
        onOpenChange={(isOpen) => !isOpen && onModalDismiss()}
        title="Welcome to Brandmeister Top Activity v2!"
      >
        <div className="flex flex-col flex-nowrap gap-4 text-sm md:text-base lg:text-lg">
          <p>
            You're previewing a pre-release version of the brand new Brandmeister Top Activity app.
            Version 2 is in active development so you may see bugs. It's a complete re-write of the
            app to take advantage of the latest technologies in the{" "}
            <span className="italic">React</span> ecosystem.
          </p>
          <p>
            I'm most excited about the new <span className="italic">Hot Talkgroups</span> section,
            which provides a fully-customizable heatmap-like view of talkgroup activity. I think
            you'll really like it, too!
          </p>
          <p>
            Finally, I also took this opportunity to re-write how aggregation of the{" "}
            <span className="italic">Brandmeister</span> Last Heard data stream works. You should
            see more accurate data about the top Talkgroup and Talker activity.
          </p>
          <p>
            I'd be delighted to hear your feedback on the new version. You can use the{" "}
            <span className="italic">feedback</span> link in the bottom-right to send me your
            thoughts once you dismiss this note.
          </p>
          <p>
            Cheers! <span className="italic">de K3HEX</span>
          </p>
          <div className="flex justify-center">
            <Button onPress={onModalDismiss}>Let's go!</Button>
          </div>
        </div>
      </ModalDialog>
    </>
  );
}

export default App;
