import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassHalf, faLightbulb, faUser } from "@fortawesome/free-solid-svg-icons";
import { H1 } from "@/components/Headings";
import { Body, Cell, Column, Header, Row, Table } from "@/components/Table";
import { getLastActive } from "@/lib/times";
import type { TopTalker } from "@/lib/types";

function getTopTalkers(talkers: TopTalker[], count: number) {
  const sortedTalkers = talkers
    .slice()
    // .filter((t) => t.id < 2999999 || t.id > 49999999)
    .sort((a, b) => a.activeSeconds - b.activeSeconds);
  return sortedTalkers.reverse().slice(0, count);
}

function TopTalkers({ talkers }: { talkers: TopTalker[] }) {
  const [topTalkers, setTopTalkers] = useState<TopTalker[]>(getTopTalkers(talkers, 20));
  const now = new Date();

  useEffect(() => {
    const newTalkers = getTopTalkers(talkers, 20);
    setTopTalkers(newTalkers);
  }, [talkers]);

  return (
    <section className="mb-6 lg:basis-1/2">
      <H1>
        <FontAwesomeIcon icon={faUser} /> Top Talkers
      </H1>
      <Table aria-label="Top 20 talkers" className="w-full">
        <Header>
          <Column isRowHeader>Callsign</Column>
          <Column>Name</Column>
          <Column>Talk time</Column>
          <Column>Last active</Column>
        </Header>
        <Body>
          {topTalkers.map((talker) => (
            <Row key={talker.id}>
              <Cell>
                {talker.callsign ? (
                  <>
                    {talker.callsign} <span className="text-sm text-accent">({talker.id})</span>
                  </>
                ) : (
                  <span className="italic">{talker.id}</span>
                )}
              </Cell>
              <Cell>{talker.name ? talker.name : "-"}</Cell>
              <Cell>{talker.activeSeconds} seconds</Cell>
              <Cell>{getLastActive(talker, now)}</Cell>
            </Row>
          ))}
        </Body>
      </Table>
      {talkers.length === 0 && (
        <p className="mt-8 text-center text-accent italic text-sm">
          <FontAwesomeIcon icon={faHourglassHalf} /> Waiting for talkers aggregation...
        </p>
      )}
      {talkers.length > 0 && topTalkers.length === 0 && (
        <p className="mt-8 text-center text-accent italic text-sm">
          <FontAwesomeIcon icon={faLightbulb} /> No talkers? Try clearing your filters!
        </p>
      )}
    </section>
  );
}

export default TopTalkers;
