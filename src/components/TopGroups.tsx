import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassHalf, faLightbulb, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Body, Cell, Column, Header, Row, Table } from "@/components/Table";
import { H1 } from "@/components/Headings";
import { getLastActive } from "@/lib/times";
import type { TopGroup } from "@/lib/types";

function getTopGroups(groups: TopGroup[], count: number) {
  const sortedGroups = groups
    .slice()
    .filter((g) => g.talkGroup < 2999999 || g.talkGroup > 49999999)
    .sort((a, b) => a.activeSeconds - b.activeSeconds);
  return sortedGroups.reverse().slice(0, count);
}

function TopGroups({ groups }: { groups: TopGroup[] }) {
  const [topGroups, setTopGroups] = useState<TopGroup[]>(getTopGroups(groups, 20));
  const now = new Date();

  useEffect(() => {
    const newGroups = getTopGroups(groups, 20);
    setTopGroups(newGroups);
  }, [groups]);

  return (
    <section className="mb-6 lg:basis-1/2">
      <H1>
        <FontAwesomeIcon icon={faUsers} /> Top Talkgroups
      </H1>
      <Table aria-label="Top 20 talkgroups" className="w-full">
        <Header>
          <Column isRowHeader>Talkgroup</Column>
          <Column>Talk time</Column>
          <Column>Last active</Column>
        </Header>
        <Body>
          {topGroups.map((group) => (
            <Row key={group.talkGroup}>
              <Cell>
                {group.name ? (
                  <>
                    {group.name} <span className="text-sm text-accent">({group.talkGroup})</span>
                  </>
                ) : (
                  <span className="italic">{group.talkGroup}</span>
                )}
              </Cell>
              <Cell>{group.activeSeconds} seconds</Cell>
              <Cell>{getLastActive(group, now)}</Cell>
            </Row>
          ))}
        </Body>
      </Table>
      {groups.length === 0 && (
        <p className="mt-8 text-center text-accent italic text-sm">
          <FontAwesomeIcon icon={faHourglassHalf} /> Waiting for talkgroup aggregation...
        </p>
      )}
      {groups.length > 0 && topGroups.length === 0 && (
        <p className="mt-8 text-center text-accent italic text-sm">
          <FontAwesomeIcon icon={faLightbulb} /> No talkgroups? Try clearing your filters!
        </p>
      )}
    </section>
  );
}

export default TopGroups;
