import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-aria-components";
import HotTile from "@/components/HotTile";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import { H1 } from "@/components/Headings";
import type { TopGroup } from "@/lib/types";

type HotGroup = {
  tg: number;
  label?: string;
  active: boolean;
  activePercent: number;
};

function HotGroups({ groups }: { groups: Map<number, TopGroup> }) {
  const [watchInput, setWatchInput] = useState("");
  const [watchTgIds, setWatchTgIds] = useState<number[]>([91, 92, 93, 94, 95]);
  const [watchGroups, setWatchGroups] = useState<HotGroup[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = Number.parseInt(watchInput);
    if (!isNaN(id)) {
      const s = new Set(watchTgIds);
      s.add(id);
      setWatchTgIds(Array.from(s.values()));
      setWatchInput("");
    }
  };

  const removeTg = (tg: number) => {
    const s = new Set(watchTgIds);
    s.delete(tg);
    setWatchTgIds(Array.from(s.values()));
  };

  useEffect(() => {
    const newGroups: HotGroup[] = [];

    for (const id of watchTgIds) {
      const g = groups.get(id);

      let hg: HotGroup;
      if (g) {
        hg = {
          tg: g.talkGroup,
          label: g.name,
          active: g.active,
          activePercent: g.activePercent,
        };
      } else {
        hg = {
          tg: id,
          active: false,
          activePercent: 0,
        };
      }

      newGroups.push(hg);
    }

    setWatchGroups(newGroups);
  }, [groups, watchTgIds]);

  return (
    <section className="mb-6 container mx-auto">
      <H1>
        <FontAwesomeIcon icon={faFire} /> Hot Talkgroups
      </H1>
      <Form className="flex gap-2 justify-center items-baseline" onSubmit={handleSubmit}>
        <TextField
          label="Watch talkgroup"
          placeholder="E.g., 3100"
          inputSize={10}
          errorMessage="Please enter a valid talkgroup ID"
          name="tgId"
          type="text"
          inputMode="numeric"
          pattern="\d{2,10}"
          className="text-sm w-60"
          value={watchInput}
          onChange={setWatchInput}
        />
        <Button type="submit" className="text-sm">
          Watch
        </Button>
      </Form>
      <div className="py-4 flex justify-center">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {watchGroups.map((g) => (
            <HotTile key={g.tg} onClick={() => removeTg(g.tg)} {...g} />
          ))}
        </div>
      </div>
      {watchGroups.length > 0 && (
        <p className="text-center text-accent italic text-sm">
          <FontAwesomeIcon icon={faLightbulb} /> Click or tap on a tile to remove the talkgroup from
          your watchlist!
        </p>
      )}
      {watchGroups.length === 0 && (
        <p className="text-center text-accent italic text-sm">
          <FontAwesomeIcon icon={faLightbulb} /> Use the input above to add talkgroups to your
          watchlist!
        </p>
      )}
    </section>
  );
}

export default HotGroups;
