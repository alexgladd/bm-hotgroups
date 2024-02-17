import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HotGroups from "@/components/HotGroups";
import useBrandmeister from "@/hooks/useBrandmeister";

function App() {
  const brandmeister = useBrandmeister(300, 5, false);

  const onBtnClick = () => {
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
        <HotGroups />
        <section>
          <h1 className="py-2 text-2xl">Brandmeister Top Activity</h1>
          <button
            type="button"
            onClick={onBtnClick}
            className="p-2 bg-primary text-light font-bold"
          >
            {brandmeister.isConnected ? "Disconnect" : "Connect"}
          </button>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default App;
