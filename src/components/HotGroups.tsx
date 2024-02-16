import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import HotTile from "@/components/HotTile";

const groups = [
  { tg: 91, active: true, label: "World Wide", activePercent: 0.95 },
  { tg: 92, active: false, activePercent: 0.85 },
  { tg: 93, active: false, activePercent: 0.75 },
  { tg: 94, active: false, activePercent: 0.65 },
  { tg: 3100, active: true, label: "USA", activePercent: 0.55 },
  { tg: 3124, active: false, activePercent: 0.45 },
  { tg: 310, active: false, label: "TAC 310", activePercent: 0.35 },
  { tg: 311, active: false, activePercent: 0.25 },
  { tg: 312, active: false, activePercent: 0.15 },
  { tg: 412, active: false, activePercent: 0.05 },
];

function HotGroups() {
  return (
    <section className="mb-6 container mx-auto">
      <h1 className="py-4 text-2xl font-bold text-center">
        <FontAwesomeIcon icon={faFire} /> Hot Groups
      </h1>
      <div className="flex justify-center">Controls</div>
      <div className="py-4 flex justify-center">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {groups.map((g) => (
            <HotTile
              key={g.tg}
              onClick={() => console.log(`Click hot tile ${g.tg}`)}
              {...g}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HotGroups;
