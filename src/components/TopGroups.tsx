import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { Body, Cell, Column, Header, Row, Table } from "@/components/Table";
import { getName } from "@/lib/bmglobal";
import type { TopGroup } from "@/lib/types";

function getTopGroups(groups: TopGroup[], count: number) {
  const sortedGroups = groups.slice().sort((a, b) => a.activeSeconds - b.activeSeconds);
  return sortedGroups.reverse().slice(0, count);
}

function TopGroups({ groups }: { groups: TopGroup[] }) {
  const [topGroups, setTopGroups] = useState<TopGroup[]>(getTopGroups(groups, 20));

  useEffect(() => {
    const newGroups = getTopGroups(groups, 20);
    for (const group of newGroups) {
      if (!group.name) group.name = getName(group.talkGroup);
    }
    setTopGroups(newGroups);
  }, [groups]);

  return (
    <section className="mb-6">
      <h1 className="py-4 text-2xl font-bold text-center">
        <FontAwesomeIcon icon={faUsers} /> Top Talkgroups
      </h1>
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
              <Cell>{group.active ? "Now" : "Some date"}</Cell>
            </Row>
          ))}
        </Body>
      </Table>
    </section>
  );
}

export default TopGroups;
